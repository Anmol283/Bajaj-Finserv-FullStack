"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Hierarchy {
  root: string;
  tree: Record<string, any>;
  depth?: number;
  has_cycle?: boolean;
}

interface BFHLResponse {
  user_id: string;
  email_id: string;
  college_roll_number: string;
  hierarchies: Hierarchy[];
  invalid_entries: string[];
  duplicate_edges: string[];
  summary: {
    total_trees: number;
    total_cycles: number;
    largest_tree_root: string;
  };
}

export default function BFHLForm() {
  const USER_ID = "Anmol_28072005";
  const EMAIL_ID = "anmol1692.be23@chitkara.edu.in";
  const ROLL_NUMBER = "2310991692";
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<BFHLResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      let lines: string[] = [];
      const trimmedInput = input.trim();

      // Try to parse as JSON array first
      if (trimmedInput.startsWith("[")) {
        try {
          const parsed = JSON.parse(trimmedInput);
          if (Array.isArray(parsed)) {
            lines = parsed.map((item) => String(item).trim()).filter((item) => item);
          } else {
            throw new Error("JSON must be an array");
          }
        } catch (jsonErr) {
          throw new Error(`Invalid JSON format: ${jsonErr instanceof Error ? jsonErr.message : "unknown error"}`);
        }
      } else {
        // Fall back to comma/newline separated
        lines = trimmedInput
          .split(/[\n,]+/)
          .map((line) => line.trim())
          .filter((line) => line);
      }

      const response = await fetch("/api/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: lines,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderTree = (tree: Record<string, any>, indent: number = 0) => {
    if (Object.keys(tree).length === 0) {
      return <div className="text-gray-400">(empty)</div>;
    }

    return (
      <ul className="list-disc ml-6 space-y-2">
        {Object.entries(tree).map(([node, children]) => (
          <li key={node} className="text-blue-600 font-semibold">
            {node}
            {Object.keys(children as Record<string, any>).length > 0 && (
              <div className="ml-4 text-gray-700">
                {renderTree(children as Record<string, any>, indent + 1)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
           BFHL- Hierarchical Relationship Processor
          </h1>
          <p className="text-gray-300">
            Enter relationships as one-per-line, comma-separated, or as a JSON array like
            {'"["A->B", "A->C"]"'}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Input</CardTitle>
              <CardDescription>Enter your node relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <Card className="bg-slate-800 border-slate-700">
                    {/* <CardHeader>
                      <CardTitle className="text-white text-sm">Submitted Credentials</CardTitle>
      
                    </CardHeader> */}
                    <CardContent className="space-y-2 text-gray-300 text-sm">
                      <div>
                        <span className="font-semibold">User ID:</span> {USER_ID}
                      </div>
                      <div>
                        <span className="font-semibold">Email:</span> {EMAIL_ID}
                      </div>
                      <div>
                        <span className="font-semibold">Roll:</span> {ROLL_NUMBER}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Node Relationships
                    </label>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={'A->B, A->C, B->D or one per line or JSON: ["A->B", "A->C"]'}
                      className="w-full h-48 p-4 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Submit"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Response Section */}
          <div className="space-y-4">
            {error && (
              <Card className="bg-red-900 border-red-700">
                <CardContent className="pt-6">
                  <p className="text-red-100">{error}</p>
                </CardContent>
              </Card>
            )}

            {response && (
              <>
                {/* Summary */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-gray-300">
                    <div className="flex justify-between">
                      <span>Total Trees:</span>
                      <span className="font-semibold text-green-400">
                        {response.summary.total_trees}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Cycles:</span>
                      <span className="font-semibold text-yellow-400">
                        {response.summary.total_cycles}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Largest Tree Root:</span>
                      <span className="font-semibold text-blue-400">
                        {response.summary.largest_tree_root || "N/A"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* User Info */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">User Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-gray-300">
                    <div>
                      <span className="font-semibold">ID:</span> {response.user_id}
                    </div>
                    <div>
                      <span className="font-semibold">Email:</span> {response.email_id}
                    </div>
                    <div>
                      <span className="font-semibold">Roll:</span>{" "}
                      {response.college_roll_number}
                    </div>
                  </CardContent>
                </Card>

                {/* Invalid Entries */}
                {response.invalid_entries.length > 0 && (
                  <Card className="bg-red-900/20 border-red-700/50">
                    <CardHeader>
                      <CardTitle className="text-red-400 text-sm">
                        Invalid Entries ({response.invalid_entries.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-red-300 text-sm">
                      {response.invalid_entries.join(", ")}
                    </CardContent>
                  </Card>
                )}

                {/* Duplicate Edges */}
                {response.duplicate_edges.length > 0 && (
                  <Card className="bg-yellow-900/20 border-yellow-700/50">
                    <CardHeader>
                      <CardTitle className="text-yellow-400 text-sm">
                        Duplicate Edges ({response.duplicate_edges.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-yellow-300 text-sm">
                      {response.duplicate_edges.join(", ")}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>

        {/* Hierarchies */}
        {response && response.hierarchies.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Hierarchies</h2>
            <div className="grid grid-cols-1 gap-4">
              {response.hierarchies.map((hierarchy, idx) => (
                <Card key={idx} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">
                      {hierarchy.has_cycle ? (
                        <span className="text-red-400">
                          Cycle (Root: {hierarchy.root})
                        </span>
                      ) : (
                        <span>
                          Tree Root: <span className="text-blue-400">{hierarchy.root}</span>
                          {hierarchy.depth && (
                            <span className="text-gray-400 text-sm ml-4">
                              (Depth: {hierarchy.depth})
                            </span>
                          )}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-300">
                    {hierarchy.has_cycle ? (
                      <p className="text-red-400">This group contains a cycle.</p>
                    ) : (
                      renderTree(hierarchy.tree)
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
