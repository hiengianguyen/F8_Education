const Handlebars = require("handlebars");

module.exports = {
  not: (a) => !a,
  same: (a, b) => a == b,
  and: (a, b) => a && b,
  sum: (a, b) => a + b,
  sortable: (field, sort) => {
    const sortType = field === sort.column ? sort.type : "default";
    const icons = {
      default: "fa-solid fa-sort",
      asc: "fa-solid fa-arrow-down-short-wide",
      desc: "fa-solid fa-arrow-down-wide-short",
    };
    const types = {
      default: "desc",
      asc: "desc",
      desc: "asc",
    };
    const icon = icons[sortType];
    const type = types[sortType];

    const href = Handlebars.escapeExpression(
      `?_sort&column=${field}&type=${type}`
    );

    const output = `<a href="${href}">
      <span class="${icon}"></span>
      </a>`;

    return new Handlebars.SafeString(output);
  },
  convertToVietnameseDateTime: (dateTime) => {
    const updatedAt = new Date(dateTime);

    const vietnameseDateTime = updatedAt.toLocaleString("vi-VN", {
      day: "2-digit", // Day of the month, 2 digits
      month: "2-digit", // Month, 2 digits
      year: "numeric", // Full year
      hour: "2-digit", // Hour in 2-digit format
      minute: "2-digit", // Minute in 2-digit format
      hour12: true, // 12-hour format (AM/PM)
    });

    const [time, period, date] = vietnameseDateTime.split(" ");
    const formattedDateTime = `${date} ${time} ${period}`;

    return formattedDateTime;
  },
};
