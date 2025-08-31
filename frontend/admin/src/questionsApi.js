import api from './api';

export const createQuestion = (
  houseName,
  questionNumber,
  questionDescription,   // use correct field name
  buggedCode,
  testCases
) => {
  // format testCases: output → expectedOutput
  const formattedTestCases = testCases.map(tc => ({
    input: tc.input,
    expectedOutput: tc.output
  }));

  return api.post('/admin-questions', {
    houseName,
    questionNumber,
    questionDescription,   // ✅ matches schema
    buggedCode,
    testCases: formattedTestCases
  });
};
