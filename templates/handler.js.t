"use strict";

const crayfish = require("crayfish-js");

exports.handler = async (event) => {
    return await crayfish.handleRequest(event);
};