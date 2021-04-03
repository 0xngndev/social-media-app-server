const paginate = (page, limit, count) => {
  const results = {};
  const start = (page - 1) * limit;
  const end = page * limit;

  if (start > 0) {
    results.previous = {
      page: page - 1,
      limit,
    };
  }

  if (end < count) {
    results.next = {
      page: page + 1,
      limit,
    };
  }

  return {
    start,
    end,
    results,
  };
};

module.exports = paginate;
