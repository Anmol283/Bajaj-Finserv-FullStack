// Tree processor for handling hierarchical relationships

interface Hierarchy {
  root: string;
  tree: Record<string, any>;
  depth?: number;
  has_cycle?: boolean;
}

interface Summary {
  total_trees: number;
  total_cycles: number;
  largest_tree_root: string;
}

interface BFHLResponse {
  user_id: string;
  email_id: string;
  college_roll_number: string;
  hierarchies: Hierarchy[];
  invalid_entries: string[];
  duplicate_edges: string[];
  summary: Summary;
}

export class BFHLProcessor {
  private validEdges: Set<string> = new Set();
  private edgeMap: Map<string, Set<string>> = new Map();
  private childToParents: Map<string, string> = new Map();
  private allNodes: Set<string> = new Set();

  validateNodeFormat(entry: string): boolean {
    const trimmed = entry.trim();
    if (!trimmed) return false;

    const parts = trimmed.split("->");
    if (parts.length !== 2) return false;

    const [parent, child] = parts;
    if (parent.length !== 1 || child.length !== 1) return false;
    if (!/^[A-Z]$/.test(parent) || !/^[A-Z]$/.test(child)) return false;
    if (parent === child) return false; // Self-loop

    return true;
  }

  process(
    data: string[],
    userId: string,
    emailId: string,
    rollNumber: string
  ): BFHLResponse {
    const invalidEntries: string[] = [];
    const duplicateEdgesSet: Set<string> = new Set();
    const hierarchies: Hierarchy[] = [];

    // Validate and categorize entries
    for (const entry of data) {
      const trimmed = entry.trim();

      if (!this.validateNodeFormat(trimmed)) {
        invalidEntries.push(trimmed);
        continue;
      }

      const [parent, child] = trimmed.split("->");
      const edge = `${parent}->${child}`;

      if (this.validEdges.has(edge)) {
        duplicateEdgesSet.add(edge);
        continue;
      }

      if (this.childToParents.has(child)) {
        // Child already has a first-encountered parent; ignore additional parent edges silently.
        continue;
      }

      this.validEdges.add(edge);
      if (!this.edgeMap.has(parent)) {
        this.edgeMap.set(parent, new Set());
      }
      this.edgeMap.get(parent)!.add(child);
      this.childToParents.set(child, parent);
      this.allNodes.add(parent);
      this.allNodes.add(child);
    }

    // Find connected components (groups)
    const visited: Set<string> = new Set();
    const groups: Set<string>[] = [];

    for (const node of this.allNodes) {
      if (!visited.has(node)) {
        const group = this.getConnectedComponent(node, visited);
        groups.push(group);
      }
    }

    // Process each group
    for (const group of groups) {
      const isCyclic = this.hasCycle(group);

      let root: string;
      if (isCyclic) {
        // Pure cycle: use lexicographically smallest node
        root = Array.from(group).sort()[0];
        hierarchies.push({
          root,
          tree: {},
          has_cycle: true,
        });
      } else {
        // Find root: node that never appears as a child
        root = this.findRoot(group);
        const tree = this.buildTree(root);
        const depth = this.calculateDepth(tree);
        hierarchies.push({
          root,
          tree,
          depth,
        });
      }
    }

    // Sort hierarchies by root for consistent output
    hierarchies.sort((a, b) => a.root.localeCompare(b.root));

    // Calculate summary
    const nonCyclicTrees = hierarchies.filter((h) => !h.has_cycle);
    const cyclicTrees = hierarchies.filter((h) => h.has_cycle);

    let largestTreeRoot = "";
    let maxDepth = 0;

    for (const hierarchy of nonCyclicTrees) {
      const depth = hierarchy.depth || 0;
      if (depth > maxDepth || (depth === maxDepth && hierarchy.root < largestTreeRoot)) {
        maxDepth = depth;
        largestTreeRoot = hierarchy.root;
      }
    }

    const summary: Summary = {
      total_trees: nonCyclicTrees.length,
      total_cycles: cyclicTrees.length,
      largest_tree_root: largestTreeRoot,
    };

    return {
      user_id: userId,
      email_id: emailId,
      college_roll_number: rollNumber,
      hierarchies,
      invalid_entries: invalidEntries,
      duplicate_edges: Array.from(duplicateEdgesSet),
      summary,
    };
  }

  private getConnectedComponent(
    startNode: string,
    visited: Set<string>
  ): Set<string> {
    const component: Set<string> = new Set();
    const queue: string[] = [startNode];

    while (queue.length > 0) {
      const node = queue.shift()!;
      if (visited.has(node)) continue;

      visited.add(node);
      component.add(node);

      // Add children
      if (this.edgeMap.has(node)) {
        for (const child of this.edgeMap.get(node)!) {
          if (!visited.has(child)) {
            queue.push(child);
          }
        }
      }

      // Add parent
      if (this.childToParents.has(node)) {
        const parent = this.childToParents.get(node)!;
        if (!visited.has(parent)) {
          queue.push(parent);
        }
      }
    }

    return component;
  }

  private hasCycle(group: Set<string>): boolean {
    const visited: Set<string> = new Set();
    const recursionStack: Set<string> = new Set();

    for (const node of group) {
      if (!visited.has(node)) {
        if (this.hasCycleDFS(node, visited, recursionStack)) {
          return true;
        }
      }
    }

    return false;
  }

  private hasCycleDFS(
    node: string,
    visited: Set<string>,
    recursionStack: Set<string>
  ): boolean {
    visited.add(node);
    recursionStack.add(node);

    if (this.edgeMap.has(node)) {
      for (const child of this.edgeMap.get(node)!) {
        if (!visited.has(child)) {
          if (this.hasCycleDFS(child, visited, recursionStack)) {
            return true;
          }
        } else if (recursionStack.has(child)) {
          return true;
        }
      }
    }

    recursionStack.delete(node);
    return false;
  }

  private findRoot(group: Set<string>): string {
    for (const node of group) {
      if (!this.childToParents.has(node)) {
        return node;
      }
    }

    // All nodes are children (shouldn't happen in non-cyclic), use lexicographically smallest
    return Array.from(group).sort()[0];
  }

  private buildTree(root: string): Record<string, any> {
    const result: Record<string, any> = {};
    const visitedInTree: Set<string> = new Set();

    const buildRecursive = (node: string): Record<string, any> => {
      if (visitedInTree.has(node)) {
        return {};
      }
      visitedInTree.add(node);

      const nodeObj: Record<string, any> = {};
      const children = this.edgeMap.get(node) || new Set();

      for (const child of Array.from(children).sort()) {
        nodeObj[child] = buildRecursive(child);
      }

      return nodeObj;
    };

    result[root] = buildRecursive(root);
    return result;
  }

  private calculateDepth(tree: Record<string, any>): number {
    const calculateDepthRecursive = (node: Record<string, any>): number => {
      const keys = Object.keys(node);
      if (keys.length === 0) {
        return 0; // Leaf node contributes 0 additional depth
      }

      let maxChildDepth = 0;
      for (const key of keys) {
        const child = node[key];
        const childDepth = calculateDepthRecursive(
          child as Record<string, any>
        );
        maxChildDepth = Math.max(maxChildDepth, childDepth);
      }

      return 1 + maxChildDepth;
    };

    // The root tree object wraps the actual root node
    const rootKeys = Object.keys(tree);
    if (rootKeys.length === 0) return 0;

    const rootNode = tree[rootKeys[0]];
    return 1 + calculateDepthRecursive(rootNode as Record<string, any>);
  }
}
