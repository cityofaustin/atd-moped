import { gql } from "apollo-boost";

class GQLAbstract {
  /**
   * Primes the internal configuration for rendering.
   *
   * @constructor
   * @param {Object} The initial configuration of the abstract
   */
  constructor(initConfig) {
    this.config = initConfig;
    this.configInit = JSON.parse(JSON.stringify(initConfig));
    this.config.filterStack = {
      where: [],
      order_by: [],
    };
  }

  /**
   * Returns a safe string copy with the basic GraphQL abstract.
   * @returns {string}
   */
  get abstractStructure() {
    return `{
      gqlAbstractTableName (
          gqlAbstractFilters
      ) {
          gqlAbstractColumns
      },
      gqlAbstractTableAggregateName (
          gqlAbstractAggregateFilters
      ) {
        aggregate {
          count
        }
      }
    }`;
  }

  /**
   * Returns false if the input string is a valid alphanumeric object key
   * @param {string} input - The string to be tested
   * @returns {boolean}
   */
  isNestedKey(input) {
    return input.match(/^[0-9a-zA-Z\-_]+$/) === null;
  }

  /**
   * Returns the key for a nested expression
   * @param {string} exp - The GraphQL expression
   * @returns {string}
   */
  getExpKey = (exp) => exp.split(/[{} ]+/, 1)[0].trim();

  /**
   * Returns the value of a nested expression, usually another expression.
   * @param {string} exp - The GraphQL expression
   * @returns {string}
   */
  getExpValue = (exp) =>
    exp.substring(exp.indexOf("{") + 1, exp.lastIndexOf("}")).trim();

  /**
   * Refactors a nested key into `sort` format
   * @param {string} exp - The nested key (usually a graphql expression)
   * @returns {string}
   */
  sortifyNestedKey = (exp, val) =>
    this.isNestedKey(exp)
      ? `${this.getExpKey(exp)}: { ${this.sortifyNestedKey(
          this.getExpValue(exp),
          val
        )} }`
      : `${exp}: ${val}`;

  /**
   * Returns the name of the table
   * @returns {string}
   */
  get table() {
    return this.config.table;
  }

  /**
   * Sets the name of the table for the abstract
   * @returns {string}
   */
  set table(val) {
    this.config.table = val;
  }

  /**
   * Sets the limit of the current query
   * @param {integer} limit - the number you want to use for a limit
   */
  set limit(limit) {
    this.config.limit = limit;
  }

  /**
   * Returns the current limit of the current configuration
   * @returns {integer}
   */
  get limit() {
    return this.config.limit;
  }

  /**
   * Sets the offset of the current configuration
   * @param {integer} offset - the number you want to use as offset
   */
  set offset(offset) {
    this.config.offset = offset;
  }

  /**
   * Returns the offset of the current configuration
   * @returns {integer}
   */
  get offset() {
    return this.config.offset;
  }

  /**
   * Resets the value of where and or to empty
   */
  cleanWhere() {
    this.config.where = { ...this.configInit.where };
    this.config.or = null;
    this.config.and = null;
  }

  /**
   * Removes all conditions that will be used for ordering.
   */
  clearOrderBy() {
    this.config.order_by = [];
  }

  /**
   * Resets original conditions used for ordering
   */
  resetOrderBy() {
    this.config.order_by = this.configInit.order_by;
  }

  /**
   * Full reset of all conditions
   */
  resetFull() {
    this.config = JSON.parse(JSON.stringify(this.configInit));
  }

  /**
   * Replaces or creates a 'where' condition in graphql syntax.
   * @param {string} key - The name of the column
   * @param {string} syntax - the graphql syntax for the where condition
   */
  setWhere(key, syntax) {
    if (!this.config.where) this.config.where = {};
    // if the key already exists in the config, we are adding an additional query for same key
    if (this.config.where[key]) {
      this.setAnd(key, syntax);
    } else {
      this.config.where[key] = syntax;
    }
  }

  /**
   * Replaces or creates an 'or' condition in graphql syntax.
   * @param {string} key - The name of the column
   * @param {string} syntax - the graphql syntax for the where condition
   */
  setOr(key, syntax) {
    if (!this.config.or) this.config.or = {};
    this.config.or[key] = syntax;
  }

  /**
   * Replaces or creates an 'and' condition in graphql syntax.
   * @param {string} key - The name of the column
   * @param {string} syntax - the graphql syntax for the where condition
   */
  setAnd(key, syntax) {
    if (!this.config.and) this.config.and = {};
    // if the key has not been added to the "and" entry, copy from "where"
    if (!this.config.and[key]) {
      this.config.and[key] = this.config.where[key];
    }
    this.config.and[key] = this.config.and[key].concat(",", syntax);
  }

  /**
   * Removes a column from the where condition
   * @param {string} key - The name of the column
   */
  deleteWhere(key) {
    delete this.config.where[key];
  }

  /**
   * Removes a column from the or condition
   * @param {object} orObject - The object to be deleted
   */
  deleteOr(orObject) {
    const keyToDelete = Object.keys(orObject)[0];
    this.config.or && delete this.config.or[keyToDelete];
  }

  /**
   * Replaces or creates an 'order_by' condition in graphql syntax.
   * @param {string} key - The name of the column
   * @param {string} syntax - either 'asc' or 'desc'
   */
  setOrder(key, syntax) {
      this.config.order_by = {};
      this.config.order_by[key] = syntax;
  }

  /**
   * Returns an array with key-value pairs
   * @param {string} section - the 'key' name of the section in the config object
   * @returns {[string, any][]}
   */
  getEntries(section) {
    return Object.entries(this.config[section] || section);
  }

  /**
   * Returns an array of strings containing the names of the columns in the current state of config
   * @returns {Array}
   */
  get columns() {
    return this.getEntries("columns").map((k) => k[0]);
  }


  /**
   * Generates the filters section and injects the abstract with finished GraphQL syntax.
   * @params {bool} aggregate - True if this is an aggregate filter
   * @returns {string}
   */
  generateFilters(aggregate = false) {
    const output = [];
    const where = [];
    const or = [];
    const and = [];

    // Aggregates do not need limit and offset filters
    if (aggregate === false) {
      if (this.config.limit) {
        output.push("limit: " + this.config.limit);
      }

      if (this.config.offset !== null) {
        output.push("offset: " + this.config.offset);
      }
    }

    if (this.config.and !== null) {
      for (const [key, value] of this.getEntries("and")) {
        const andValues = value.split(",");
        andValues.forEach((andValue) => and.push(`{${key}: {${andValue}}}`));
        // remove key from where clause after including the values in "and"
        this.deleteWhere(key);
      }
    }

    // If there are any where
    if (this.config.where !== null) {
      for (const [key, value] of this.getEntries("where")) {
        // If we have a nested expression for a key, then append to 'or'
        if (this.isNestedKey(key)) {
          or.push(`{ ${key} }`);
          // Else, append to 'where'
        } else {
          where.push(`${key}: {${value}}`);
        }
      }
    }

    if (this.config.or !== null) {
      for (const [key, value] of this.getEntries("or")) {
        or.push(`{${key}: {${value}}}`);
      }
    }

    output.push(
      "where: {" +
        (where.length > 0 ? where.join(", ") + ", " : "") +
        (or.length > 0 ? "_or: [" + or.join(", ") + "]" : "") +
        (and.length > 0 ? "_and: [" + and.join(", ") + "]" : "") +
        "}"
    );

    // Previous comment indicated we don't support a second tier ordering directive,
    // but the following code appears to support it.
    if (this.config.order_by) {
      const orderBy = [];
      for (const [key, value] of this.getEntries("order_by")) {
        orderBy.push(
          this.isNestedKey(key)
            ? this.sortifyNestedKey(key, value)
            : `${key}: ${value}`
        );
      }
      output.push(`order_by: {${orderBy.join(", ")}}`);
    }

    return output.join(",\n");
  }

  /**
   * Generates a list with the names of the columns in graphql syntax
   * @returns {string}
   */
  generateColumns() {
    return this.columns.join("\n");
  }

  /**
   * Generates a GraphQL query based on the current state of the configuration.
   * @returns {string}
   */
  get query() {
    // First copy the abstract and work from the copy
    let query = this.abstractStructure;

    // Replace the name of the table
    query = query.replace("gqlAbstractTableName", this.config.table);
    query = query.replace(
      "gqlAbstractTableAggregateName",
      this.config.table + "_aggregate"
    );

    // Generate Filters
    query = query.replace("gqlAbstractFilters", this.generateFilters());
    query = query.replace(
      "gqlAbstractAggregateFilters",
      this.generateFilters(true)
    );

    // Generate Columns
    query = query.replace("gqlAbstractColumns", this.generateColumns());

    // Aggregate Tables

    return query;
  }

  /**
   * Generates a GraphQL query based on columns passed in for export feature.
   * @params {string} - String containing columns to return in query.
   * @returns {Object} gql Object
   */
  queryCSV(string) {
    // First copy the abstract and work from the copy and clear offset to request all records
    let query = this.abstractStructure;
    this.offset = 0;

    // Replace the name of the table
    query = query.replace("gqlAbstractTableName", this.config.table);
    query = query.replace(
      "gqlAbstractTableAggregateName",
      this.config.table + "_aggregate"
    );

    // Generate Filters
    query = query.replace("gqlAbstractFilters", this.generateFilters());
    query = query.replace(
      "gqlAbstractAggregateFilters",
      this.generateFilters(true)
    );

    // Generate Columns
    query = query.replace("gqlAbstractColumns", string);

    // Return GraphQL query
    return gql`
      ${query}
    `;
  }

  /**
   * Generates a GraphQL query based on queryConfigArray passed in to set aggregate filters from table filters.
   * @params {queryConfigArray} - Array of config objects (object keys are table, columns, and key (if nested)).
   * @params {queryInstance} - Query instance to get table filters and set in aggregate queries.
   * @returns {Object} gql Object
   */
  queryAggregate(queryConfigArray, queryInstance) {
    // Create array to store each query
    const aggregatesQueryArray = [];

    // For each config, create query, replace filters/columns, and push to aggregatesQueryArray
    queryConfigArray.forEach((config) => {
      let query = `
      gqlAbstractTableAggregateName (
          gqlAbstractAggregateFilters
      ) {
          aggregate {
            gqlAggregateColumns
          }
        }
      `;
      // Replace the name of the aggregate table
      query = query.replace("gqlAbstractTableAggregateName", config.table);

      // Retrieve filters from query instance and add to aggregate query
      const whereFilters = [];
      const orFilters = [];
      Object.entries(queryInstance.config.where).forEach(([filter, value]) => {
        // If we have a nested expression for a key, then append to 'or'
        if (this.isNestedKey(filter)) {
          orFilters.push(`{ ${filter} }`);
          // Else, append to 'where'
        } else {
          whereFilters.push(`${filter}: { ${value} }`);
        }
      });

      // Retrieve or filters from query instance
      if (queryInstance.config.or) {
        Object.entries(queryInstance.config.or).forEach(([filter, value]) =>
          orFilters.push(`{${filter}: { ${value} }}`)
        );
      }

      if (orFilters.length > 0) {
        const orString = `_or: [ ${orFilters.join(",")} ]`;
        whereFilters.push(orString);
      }
      // If a key is defined in config, nest whereFilters
      query = config.key
        ? query.replace(
            "gqlAbstractAggregateFilters",
            `where: { ${config.key}: { ${whereFilters} } }`
          )
        : query.replace(
            "gqlAbstractAggregateFilters",
            `where: { ${whereFilters} }`
          );

      // Generate Columns
      query = query.replace("gqlAggregateColumns", config.columns.join(" "));

      aggregatesQueryArray.push(query);
    });
    // Join each aggregate query into one string
    const aggregatesQueryString = aggregatesQueryArray.join(" ");

    // Return GraphQL query
    return gql`query GetLocationStats {
      ${aggregatesQueryString}
    }`;
  }

  /**
   * Returns a GQL object based on the current state of the configuration.
   * @returns {Object} gql object
   */
  get gql() {
    return gql`
      ${this.query}
    `;
  }
}

export default GQLAbstract;
