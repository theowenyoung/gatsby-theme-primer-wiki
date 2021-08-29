import React from "react";
import { Button, Overlay, Box, Text } from "@primer/components";
const Demo = () => {
  // you must manage your own open state
  const [isOpen, setIsOpen] = React.useState(false);
  const noButtonRef = React.useRef(null);
  const anchorRef = React.useRef(null);
  return (
    <Box>
      <Button ref={anchorRef} onClick={() => setIsOpen(!isOpen)}>
        open overlay
      </Button>
      {/* be sure to conditionally render the Overlay. This helps with performance and is required. */}
      {isOpen && (
        <Box>
          <Overlay
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
            }}
            initialFocusRef={noButtonRef}
            returnFocusRef={anchorRef}
            ignoreClickRefs={[anchorRef]}
            onEscape={() => setIsOpen(!isOpen)}
            onClickOutside={() => setIsOpen(false)}
            aria-labelledby="title"
          >
            <Box display="flex" flexDirection="column" p={2}>
              <Text id="title">
                Are you sure you would like to delete this item?
              </Text>
              <Button>yes</Button>
              <Button ref={noButtonRef}>no</Button>
            </Box>
          </Overlay>
        </Box>
      )}
    </Box>
  );
};

export default Demo;
