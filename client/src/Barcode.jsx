import bwipjs from '@bwip-js/browser';  // Platform-specific package import

export default function Barcode({exists,code}) {
    if(exists){
        return (
            <canvas
                ref={(canvas) => {
                    if (!canvas) {
                    return;
                    }

                    bwipjs.toCanvas(canvas, {
                    bcid:        'code32',               // Barcode type
                    text:        code,            // Text to encode
                    scale:       window.devicePixelRatio, // Scaling factor for high-DPI devices
                    height:      10,                      // Bar height, in millimeters
                    includetext: true,                    // Show human-readable text
                    textxalign:  'center',                // Always good to set this
                    });
                }}
            />
        );
    }
    return null;
}