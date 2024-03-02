class APIFeatures {
  constructor(queryDB, queryString) {
    this.queryDB = queryDB;
    this.queryString = queryString;
  }

  //? 1A- prepaire the Query with normal filter ( .find(object))
  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((exc) => delete queryObj[exc]);

    //? 1B-advanced filtering with lte, lt , gt. gte
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(lte|lt|gt|gte)\b/g, (match) => `$${match}`);
    this.queryDB = this.queryDB.find(JSON.parse(queryStr));
    return this;
  }

  //? 2- Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.queryDB = this.queryDB.sort(sortBy);
    } else {
      this.queryDB = this.queryDB.sort("-createdAt");
    }
    return this;
  }

  //? 3- limit the outaput displayed fields ( parameters)
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.queryDB = this.queryDB.select(`${fields} __v`);
    } else {
      this.queryDB = this.queryDB.select("-__v");
    }
    return this;
  }

  //? 4- paginate (limit the no. of results in pages and show by page number)
  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;
    this.queryDB = this.queryDB.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;
