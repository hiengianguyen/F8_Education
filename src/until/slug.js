function generateSlug(name) {
    return name
      .toLowerCase() // Chuyển thành chữ thường
      .trim() // Loại bỏ khoảng trắng ở đầu và cuối
      .replace(/[^a-z0-9 -]/g, '') // Loại bỏ các ký tự không phải chữ cái, số hoặc dấu gạch ngang
      .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
      .replace(/-+/g, '-'); // Thay thế nhiều dấu gạch ngang liên tiếp bằng một dấu gạch ngang duy nhất
}

module.exports = generateSlug;
