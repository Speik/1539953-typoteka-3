'use strict';

const {Config} = require(`../../assets/config`);
const {getRandomInt, shuffle} = require(`../../assets/utils`);
const {titles, textSentences, categories} = require(`../../assets/contents.json`);
const fs = require(`fs`);

// Returns record title
const getTitle = () => {
  return titles[getRandomInt(0, titles.length - 1)];
};

// Returns random count of announce sentences for publication
const getAnnounce = () => {
  const sentencesCount = getRandomInt(Config.MIN_ANNOUNCE_LENGTH, Config.MAX_ANNOUNCE_LENGTH);
  const shuffledSentences = shuffle(textSentences);

  return shuffledSentences.slice(0, sentencesCount).join(` `);
};

// Returns random count of text sentences for publication
const getText = () => {
  const sentencesCount = getRandomInt(1, textSentences.length - 1);

  return textSentences.slice(0, sentencesCount);
};

// Returns DateTime segment handled with padStart
const handleDateTimeSegment = (segment) => {
  return segment.toString().padStart(2, `0`);
};

// Returns date in format of [yyyy.MM.dd HH:mm:ss]
const formatDateTime = (dateTime) => {
  // Get Date segments
  const year = dateTime.getFullYear();
  const month = handleDateTimeSegment(dateTime.getMonth());
  const day = handleDateTimeSegment(dateTime.getDay());

  // Get Time segments
  const hours = handleDateTimeSegment(dateTime.getHours());
  const minutes = handleDateTimeSegment(dateTime.getMinutes());
  const seconds = handleDateTimeSegment(dateTime.getSeconds());

  // Concat segments of each part
  const date = [year, month, day].join(`-`);
  const time = [hours, minutes, seconds].join(`:`);

  return `${date} ${time}`;
};

// Returns random publication date
const getRandomDateTime = () => {
  const currentDate = new Date();

  // Get two date edges that depends on specified maximum month ago value
  const newestDateTimeEdge = Number(currentDate);
  // Here oldestDateEdge is already have number type
  const oldestDateTimeEdge = currentDate.setMonth(currentDate.getMonth() - Config.DateMaxMonthsAgo);

  // Get random timestamp
  const randomTimestamp = getRandomInt(oldestDateTimeEdge, newestDateTimeEdge);
  const randomDateTime = new Date(randomTimestamp);

  // Returns formatted date
  return formatDateTime(randomDateTime);
};

// Returns random publication categories array
const getCategories = () => {
  const categoriesCount = getRandomInt(1, categories.length - 1);

  return categories.slice(0, categoriesCount);
};

// Writes mocks data to json file
const writeContentToFile = (body) => {
  fs.writeFile(Config.FILE_NAME, body, (error) => {
    if (error) {
      console.error(`Can't write data to file...`);
      return process.exit(Config.Codes.ERROR);
    }

    console.info(`Operation success. File created.`);
    return process.exit(Config.Codes.SUCCESS);
  });
};

// Returns generated publications data
const generateExecutor = (count) => {
  // Creates specified count of empty objects and fills it with data
  const data = Array(count).fill({}).map(() => {
    return {
      title: getTitle(),
      announce: getAnnounce(),
      fullText: getText(),
      createdDate: getRandomDateTime(),
      category: getCategories()
    };
  });

  // Create JsonResult and write it to result file
  const jsonData = JSON.stringify(data);
  writeContentToFile(jsonData);
};

module.exports = {generateExecutor};
