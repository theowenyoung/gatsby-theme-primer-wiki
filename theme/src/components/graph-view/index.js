import React, { useRef, useEffect } from "react";
import useHotkeys from "@reecelucas/react-use-hotkeys";
import { NoteGraphView, NoteGraphModel } from "note-graph";
import { navigate } from "gatsby";
import { createPortal } from "react-dom";
import { useGraphData } from "../../use-note-graph-data";
import { useWindowSize } from "../../use-window-size";
import { Box, Overlay } from "@primer/components";
import "./graph-view.css";

const RESULTS_WIDTH = 300;

export default function GraphView({
  setGraphState,
  graphState,
  currentFileId,
  tagsGroups,
}) {
  const { notesMap } = useGraphData(tagsGroups);
  const windowSize = useWindowSize();
  const graphContainer = useRef(null);
  const shouldShowGraph = graphState !== "hidden";

  const modalSize = {
    width: Math.min(windowSize.width - 40, 1400),
    height: Math.min(windowSize.height - 40, 800),
  };

  const notes = Array.from(notesMap.values());
  let noteGraphView;

  useEffect(() => {
    if (!graphContainer.current || graphState === "hidden") {
      return;
    }

    const graphModel = new NoteGraphModel(notes);

    noteGraphView = new NoteGraphView({
      container: graphContainer.current,
      graphModel,
      width: modalSize.width - RESULTS_WIDTH,
      height: modalSize.height,
    });

    noteGraphView.onInteraction("nodeClick", ({ node }) => {
      if (node.url) {
        navigate(node.url);
      }
    });

    if (currentFileId) {
      const currentNoteInfo = graphModel.getNodeInfoById(currentFileId);
      const shouldZoomToFit =
        currentNoteInfo && Boolean(currentNoteInfo.neighbors?.length);
      noteGraphView.setSelectedNodes([currentFileId], { shouldZoomToFit });
    }

    return () => {
      noteGraphView.dispose();
    };
  }, [notes, graphState]);

  useHotkeys("Escape", () => {
    setGraphState("hidden");
  });

  return createPortal(
    <Box>
      <Box
        aria-hidden
        zIndex="98"
        position="fixed"
        top="0"
        right="0"
        bottom="0"
        left="0"
        display={shouldShowGraph ? "block" : "none"}
        alignItems="center"
        justifyContent="center"
        height="100%"
        width="100%"
        bg="bg.backdrop"
        sx={{
          backdropFilter: " blur(4px)",
        }}
        onClick={(ev) => {
          if (!ev.isDefaultPrevented()) {
            setGraphState("hidden");
          }
        }}
      />

      <Box
        sx={{
          zIndex: 99,
          top: 0,
          left: 0,
          position: "fixed",
          width: "100%",
          height: "100%",
          borderRadius: " 8px",
          backgroundColor: "bg.backdrop",
          boxShadow: "overlay.shadow",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={(ev) => ev.preventDefault()}
        style={{ display: shouldShowGraph ? "flex" : "none" }}
      >
        <Box
          style={{
            width: modalSize.width,
            height: modalSize.height,
          }}
        >
          <button
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              padding: "5px",
              border: 0,
              background: "none",
              color: "text.primary",
              cursor: "pointer",
              svg: {
                width: "20px",
                height: "20px",
              },
              path: {
                fill: "currentcolor",
              },
            }}
            type="button"
            onClick={() => {
              setGraphState("hidden");
            }}
            aria-label="Close Graph"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M11.997 9.90045L20.9 1L23 3.09955L14.097 12L23 20.9005L20.9 23L11.997 14.0995L3.10001 22.994L1 20.8944L9.89699 12L1 3.10558L3.10001 1.00603L11.997 9.90045Z" />
            </svg>
          </button>
          <Box className="modal-body" height="100%" width="100%">
            <Box display="flex" justifyContent="center" alignItems="center">
              <div>
                <div ref={graphContainer} id="graph-container"></div>
                <Box
                  sx={{
                    color: "text.secondary",
                    fontSize: "1.5em",
                    marginTop: "0.5em",
                  }}
                >
                  Press Esc to close this modal.
                </Box>
              </div>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>,
    document.body
  );
}
