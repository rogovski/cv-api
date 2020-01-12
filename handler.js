'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

/**
 * resource not found
 */
const notFound = () => {
  return {
    statusCode: 404,
    headers: {
      'Content-Type': 'text/markdown; charset=UTF-8'
    },
    body: 'page not found'
  };
};

/**
 * internal error
 */
const internalError = () => {
  return {
    statusCode: 500,
    headers: {
      'Content-Type': 'text/markdown; charset=UTF-8'
    },
    body: 'internal error'
  };
};

/**
 * return the resource
 */
const ok = (resource) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=UTF-8'
    },
    body: resource
  };
};

/**
 * get a resource from s3
 */
const getResource = async (name) => {
  const params = {
    Bucket: process.env.BUCKET,
    Key: name
  };
  let data;

  try {
    let response = await s3.getObject(params).promise();
    data = response.Body.toString('utf-8');
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      return notFound();
    }
    return internalError();
  }

  return ok(data);
};

/**
 * GET /about
 */
module.exports.aboutGet = async event => {
  console.log(event);
  let about = await getResource('about.md');
  return about;
};

/**
 * GET /contact
 */
module.exports.contactGet = async event => {
  let contact = await getResource('contact.md');
  return contact;
};

/**
 * POST /contact
 */
module.exports.contactPost = async event => {
  return notFound();
};

/**
 * GET /employers
 * GET /employers/{employer}
 */
module.exports.employersGet = async event => {
  // list all employers
  if (event.path === '/employers') {
    const params = {
      Bucket: process.env.BUCKET,
      Prefix: 'employers'
    };
    let data;

    try {
      let response = await s3.listObjects(params).promise();
      data = [
        '# Employers\n', ...response.Contents.map(c => c.Key)
      ];
    } catch (error) {
      return internalError();
    }

    return ok(data.join('\n'));
  }
  // get a single employer
  let id = event.pathParameters.employer.toLowerCase();
  let employer = await getResource(`employers/${id}.md`);
  return employer;
};

/**
 * GET /education
 */
module.exports.educationGet = async event => {
  let education = await getResource('education.md');
  return education;
};

/**
 * GET /references
 */
module.exports.referencesGet = async event => {
  let references = await getResource('references.md');
  return references;
};

