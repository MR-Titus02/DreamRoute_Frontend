import React, { useEffect, useState, useCallback, useRef } from "react";
import ReactFlow, { Background, Controls, Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Lock } from "lucide-react";
import PlansModal from "@/components/PlansModal"; 

const NODE_WIDTH = 280;
const NODE_HEIGHT = 140;

function CustomNode({ data }) {
  const { label, description } = data;

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        border: "2px solid var(--primary)",
        background: "var(--card)",
        color: "var(--card-foreground)",
        minWidth: NODE_WIDTH,
        maxWidth: NODE_WIDTH,
        height: NODE_HEIGHT,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{
          background: "var(--primary)",
          borderRadius: "50%",
          width: 10,
          height: 10,
        }}
      />
      <div>
        <div style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8, color: "var(--primary)" }}>
          {label}
        </div>
        <div style={{ fontSize: 14, opacity: 0.9, whiteSpace: "pre-wrap", lineHeight: "1.4" }}>
          {description}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: "var(--primary)",
          borderRadius: "50%",
          width: 10,
          height: 10,
        }}
      />
    </div>
  );
}

const nodeTypes = { customNode: CustomNode };

export default function CareerRoadmapReactFlow() {
  const { user } = useAuth();
  const storedUser = localStorage.getItem("user");
  let storedUserId;
  try {
    storedUserId = storedUser ? JSON.parse(storedUser)?.id : undefined;
  } catch (parseError) {
    console.error("Failed to read stored user:", parseError);
  }
  const userId = user?.id || storedUserId;

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [career, setCareer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlansModal, setShowPlansModal] = useState(false);

  const printRef = useRef();

  const fetchRoadmap = useCallback(async () => {
    if (!userId) {
      setError("Your account could not be identified. Please sign in again.");
      setNodes([]);
      setEdges([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setNodes([]);
    setEdges([]);

    try {
      let res;
      try {
        res = await api.get(`/career/${userId}`);
      } catch (requestError) {
        if (requestError.response?.status !== 404) throw requestError;
        await api.post("/career/generate", { userId });
        res = await api.get(`/career/${userId}`);
      }
      if (res.data.type !== "reactflow") throw new Error("Invalid roadmap format.");

      const { nodes: rawNodes, edges: rawEdges, career: careerTitle } = res.data.content;
      if (!Array.isArray(rawNodes) || !Array.isArray(rawEdges)) {
        throw new Error("Unexpected career map response.");
      }

      const preparedNodes = rawNodes.map((node, index) => ({
        ...node,
        id: String(node.id),
        type: "customNode",
        position: node.position || {
          x: (index % 2) * (NODE_WIDTH + 100),
          y: Math.floor(index / 2) * (NODE_HEIGHT + 80),
        },
        data: {
          ...node.data,
          label: node.data.label || `Step ${index + 1}`,
          description: node.data.description || "Career path step",
        },
        style: { width: NODE_WIDTH, height: NODE_HEIGHT },
      }));

      const preparedEdges = rawEdges.map((edge, index) => ({
        id: `e${edge.source}-${edge.target}-${index}`,
        source: String(edge.source),
        target: String(edge.target),
        sourceHandle: "bottom",
        targetHandle: "top",
        type: "smoothstep",
        animated: true,
        style: { stroke: "var(--primary)", strokeWidth: 2 },
        markerEnd: { type: "arrowclosed", color: "var(--primary)", width: 20, height: 20 },
      }));

      setCareer(careerTitle);
      setNodes(preparedNodes);
      setEdges(preparedEdges);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("We couldn't load your career map. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const regenerateRoadmap = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      await api.post("/career/generate", { userId });
      await fetchRoadmap();
    } catch (err) {
      console.error("Regenerate error:", err);
      setError("We couldn't regenerate your career map. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const handlePrint = () => {
  //   const printContent = printRef.current;
  //   const printWindow = window.open("", "_blank");
  //   printWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>Career Roadmap</title>
  //         <style>
  //           body {
  //             font-family: Arial, sans-serif;
  //             padding: 20px;
  //             background: white;
  //             color: black;
  //           }
  //           h1 {
  //             color: #111;
  //             text-align: center;
  //             font-size: 24px;
  //             margin-bottom: 20px;
  //           }
  //           .react-flow__renderer {
  //             width: 100% !important;
  //             height: auto !important;
  //             overflow: visible !important;
  //           }
  //           .react-flow {
  //             background: white !important;
  //             width: 100% !important;
  //             height: auto !important;
  //           }
  //           * {
  //             margin: 0;
  //             padding: 0;
  //             box-sizing: border-box;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         ${printContent.innerHTML}
  //       </body>
  //     </html>
  //   `);
  //   printWindow.document.close();
  //   printWindow.focus();
  //   setTimeout(() => {
  //     printWindow.print();
  //     printWindow.close();
  //   }, 500);
  // };

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  const isPremium = user?.plan === "pro" || user?.plan === "premium";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background p-4 text-foreground sm:p-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div role="status" className="flex h-[300px] flex-col items-center justify-center space-y-4 text-muted-foreground">
              <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
              <p className="text-lg font-medium">Loading your career map…</p>
            </div>
          ) : error ? (
            <div role="alert" className="mx-auto mb-6 max-w-2xl rounded-lg border border-error/30 bg-destructive/10 p-4 text-center text-error">
              <p className="mb-3">{error}</p>
              <Button
                variant="outline"
                onClick={fetchRoadmap}
              >
                Try again
              </Button>
            </div>
          ) : (
            <>
              <div ref={printRef}>
                <h1 className="mb-2 text-center text-3xl font-bold text-foreground sm:text-4xl">
                  Career path: <span className="text-primary">{career || "Not available"}</span>
                </h1>
                <p className="mb-6 text-center text-sm text-muted-foreground">
                  Interactive visualization of your career progression
                </p>

                {nodes.length === 0 ? (
                  <div className="flex min-h-64 items-center justify-center rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
                    No career map steps are available yet.
                  </div>
                ) : (
                <div className="h-[min(750px,75vh)] min-h-[420px] w-full rounded-xl border border-border bg-background p-2 shadow-sm">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                    panOnDrag
                    zoomOnScroll
                    nodeTypes={nodeTypes}
                    attributionPosition="bottom-left"
                    nodesDraggable={true}
                    nodesConnectable={false}
                  >
                    <Controls
                      style={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                      }}
                    />
                    <Background gap={24} size={1} color="var(--border)" variant="dots" />
                  </ReactFlow>
                </div>
                )}
              </div>

              <div className="mt-6 flex justify-center">
              <Button
  onClick={() => {
    isPremium ? regenerateRoadmap() : setShowPlansModal(true);
  }}
  className="rounded-lg"
  disabled={loading}
>
  <span>Regenerate map</span>
  {!isPremium && <Lock size={16} className="ml-2 text-yellow-400" />}
</Button>

              </div>
            </>
          )}
        </div>
      </div>

      {/* ✅ Modal usage */}
      <PlansModal isOpen={showPlansModal} onClose={() => setShowPlansModal(false)} />
    </DashboardLayout>
  );
}
