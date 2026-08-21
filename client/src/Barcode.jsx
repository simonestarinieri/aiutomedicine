import bwipjs from '@bwip-js/browser';  // Platform-specific package import

export default function Barcode({exists,code}) {
    const handleFullscreen = (id)=>{
        let element=document.getElementById(id);
        element.requestFullscreen()
    }
    if(exists){
        return (
            <canvas className='barcode'
            id={code}
            onClick={() => handleFullscreen(code)}
                ref={(canvas) => {
                    if (!canvas) {
                    return;
                    }

                    bwipjs.toCanvas(canvas, {
                    bcid:        'code32',               // Barcode type
                    text:        code,            // Text to encode
                    scale:       50, // Scaling factor for high-DPI devices
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