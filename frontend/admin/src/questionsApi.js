import api from './api';

export const createQuestion = (houseName, questionNumber, buggedCode, testCases) => {
  return api.post('/admin-questions', {
    houseName,
    questionNumber,
    buggedCode,
    testCases
  });
};
