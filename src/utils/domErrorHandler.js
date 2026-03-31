if (typeof window !== "undefined") {
  const originalRemoveChild = Node.prototype.removeChild;

  Node.prototype.removeChild = function (child) {
    try {
      if (this.contains(child)) {
        return originalRemoveChild.call(this, child);
      } else {
        return child;
      }
    } catch (error) {
      if (error.name === "NotFoundError") {
        return child;
      }
      throw error;
    }
  };
}
