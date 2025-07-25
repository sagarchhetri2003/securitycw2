module.exports = function limitPayload(maxSizeInBytes) {
    return function (req, res, next) {
      let totalBytes = 0;
  
      req.on("data", (chunk) => {
        totalBytes += chunk.length;
  
        // If limit exceeded, destroy socket and stop further processing
        if (totalBytes > maxSizeInBytes) {
          req.destroy(); //  Clean way to abort without causing parse error
        }
      });
  
      req.on("end", () => {
        next(); //  Proceed to next middleware only after data fully read
      });
  
      req.on("error", (err) => {
        console.error("Request stream error:", err.message);
        res.status(400).json({ error: "Bad Request" });
      });
    };
  };
  