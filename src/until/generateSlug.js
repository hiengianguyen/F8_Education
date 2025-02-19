const { nanoid } = require('nanoid');

function generateSlug(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-') 
      .replace(/-+/g, '-')
      + '-' + nanoid(4);
}

module.exports = generateSlug;
