function generateSlug(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-') 
      .replace(/-+/g, '-');
}

module.exports = generateSlug;
