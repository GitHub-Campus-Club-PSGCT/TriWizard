import React, { useState, createContext, useContext } from 'react';
import { ChevronLeft, Users, BookOpen, Home, Wand2, Star, Crown, Trophy, Plus, Minus, LogIn, LogOut } from 'lucide-react';

// Context for global state management
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [houseAssignments, setHouseAssignments] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AppContext.Provider value={{
      teams, setTeams,
      questions, setQuestions,
      houseAssignments, setHouseAssignments,
      isAuthenticated, setIsAuthenticated
    }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

// Router component
const Router = ({ currentRoute, setCurrentRoute, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 relative overflow-hidden">
      {/* Magical background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-red-400 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 bg-green-400 rounded-full animate-bounce"></div>
      </div>
      
      {/* Parchment texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/30 via-amber-100/20 to-orange-200/30 backdrop-blur-sm"></div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Login Page
const LoginPage = ({ setCurrentRoute }) => {
  const { setIsAuthenticated } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'ghccadmin' && password === 'triwizard25') {
      setIsAuthenticated(true);
      setCurrentRoute('home');
    } else {
      alert('Invalid username or password!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-8 rounded-lg shadow-2xl border-4 border-purple-600">
          <div className="text-center mb-6">
            <Crown className="w-16 h-16 text-purple-700 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-purple-900 mb-2 font-serif">Admin Portal</h1>
            <p className="text-purple-700">Enter the secret passage to Hogwarts administration</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username..."
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-400 focus:border-purple-600 focus:outline-none bg-white text-purple-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-400 focus:border-purple-600 focus:outline-none bg-white text-purple-900"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Enter Hogwarts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Landing Page / Dashboard
const HomePage = ({ setCurrentRoute }) => {
  const { teams, setTeams, questions, isAuthenticated, setIsAuthenticated } = useAppContext();

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentRoute('login');
  };

  const adjustScore = (teamId, adjustment) => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, score: Math.max(0, (team.score || 0) + adjustment) }
        : team
    ));
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-8">
        <div></div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center">
        {/* Hogwarts Crest */}
        <div className="mb-8 text-center">
          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-600">
            <Crown className="w-16 h-16 text-yellow-200" />
          </div>
          <h1 className="text-6xl font-bold text-amber-900 mb-2 tracking-wider font-serif">
            HOGWARTS
          </h1>
          <h2 className="text-3xl font-semibold text-amber-800 mb-4">Quiz Master</h2>
          <p className="text-lg text-amber-700 italic">"Draco dormiens nunquam titillandus"</p>
        </div>

        {/* Admin Stats */}
        <div className="w-full max-w-4xl mb-8">
          <div className="bg-white/80 p-6 rounded-lg shadow-xl border-2 border-amber-400">
            <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">Administration Overview</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-amber-900">{teams.length}</div>
                <div className="text-amber-700">Total Teams</div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-amber-900">{teams.reduce((sum, team) => sum + (team.students?.length || 0), 0)}</div>
                <div className="text-amber-700">Total Students</div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-amber-900">{questions.length}</div>
                <div className="text-amber-700">Questions Created</div>
              </div>
            </div>
          </div>
        </div>

        {/* House Colors Border */}
        <div className="w-full max-w-4xl h-2 bg-gradient-to-r from-red-600 via-blue-600 via-yellow-500 to-green-600 rounded-full mb-8"></div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-4 gap-6 w-full max-w-6xl mb-8">
          {/* Create Teams */}
          <div 
            onClick={() => setCurrentRoute('create-teams')}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-lg shadow-2xl border-4 border-yellow-600 hover:border-yellow-400">
              <div className="text-center">
                <Users className="w-12 h-12 text-yellow-200 mx-auto mb-3 group-hover:animate-bounce" />
                <h3 className="text-lg font-bold text-yellow-100 mb-2">Create Teams</h3>
                <p className="text-yellow-200 text-xs">Assemble magical teams</p>
              </div>
            </div>
          </div>

          {/* Create Questions */}
          <div 
            onClick={() => setCurrentRoute('create-questions')}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg shadow-2xl border-4 border-yellow-600 hover:border-yellow-400">
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-yellow-200 mx-auto mb-3 group-hover:animate-bounce" />
                <h3 className="text-lg font-bold text-yellow-100 mb-2">Create Questions</h3>
                <p className="text-yellow-200 text-xs">Craft mystical challenges</p>
              </div>
            </div>
          </div>

          {/* Assign House */}
          <div 
            onClick={() => setCurrentRoute('assign-house')}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg shadow-2xl border-4 border-yellow-600 hover:border-yellow-400">
              <div className="text-center">
                <Wand2 className="w-12 h-12 text-yellow-200 mx-auto mb-3 group-hover:animate-bounce" />
                <h3 className="text-lg font-bold text-yellow-100 mb-2">Assign House</h3>
                <p className="text-yellow-200 text-xs">Sorting Hat ceremony</p>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div 
            onClick={() => setCurrentRoute('leaderboard')}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg shadow-2xl border-4 border-yellow-600 hover:border-yellow-400">
              <div className="text-center">
                <Trophy className="w-12 h-12 text-yellow-200 mx-auto mb-3 group-hover:animate-bounce" />
                <h3 className="text-lg font-bold text-yellow-100 mb-2">Leaderboard</h3>
                <p className="text-yellow-200 text-xs">Championship standings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Management */}
        {teams.length > 0 && (
          <div className="w-full max-w-4xl">
            <div className="bg-white/80 p-6 rounded-lg shadow-xl border-2 border-amber-400">
              <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">Score Management</h3>
              <div className="space-y-3">
                {teams.map((team) => (
                  <div key={team.id} className="bg-amber-50 p-4 rounded-lg border border-amber-300 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-amber-900">{team.name}</h4>
                      <div className="text-sm text-amber-700">Score: {team.score || 0}</div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => adjustScore(team.id, -1)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => adjustScore(team.id, 1)}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Magical Footer */}
        <div className="mt-12 text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
          </div>
          <p className="text-amber-700 text-sm italic">Welcome to Hogwarts School of Witchcraft and Wizardry</p>
        </div>
      </div>
    </div>
  );
};

// Create Teams Page
const CreateTeamsPage = ({ setCurrentRoute }) => {
  const { teams, setTeams } = useAppContext();
  const [teamName, setTeamName] = useState('');
  const [students, setStudents] = useState([
    { name: '', rollNumber: '' },
    { name: '', rollNumber: '' },
    { name: '', rollNumber: '' }
  ]);

  const handleStudentChange = (index, field, value) => {
    const newStudents = [...students];
    newStudents[index][field] = value;
    setStudents(newStudents);
  };

  const handleSubmit = () => {
    if (teamName.trim() && students.every(s => s.name.trim() && s.rollNumber.trim())) {
      const newTeam = {
        id: Date.now(),
        name: teamName,
        students: students,
        score: 0
      };
      setTeams([...teams, newTeam]);
      setTeamName('');
      setStudents([
        { name: '', rollNumber: '' },
        { name: '', rollNumber: '' },
        { name: '', rollNumber: '' }
      ]);
      alert('Team created successfully!');
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => setCurrentRoute('home')}
          className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-800 text-yellow-100 px-4 py-2 rounded-lg shadow-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
        <h1 className="text-4xl font-bold text-amber-900 font-serif">Create Teams</h1>
        <div></div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Form Card */}
        <div className="bg-gradient-to-br from-amber-100 to-yellow-100 p-8 rounded-lg shadow-2xl border-4 border-amber-600">
          <div className="text-center mb-6">
            <Users className="w-16 h-16 text-amber-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Assemble Your Magical Team</h2>
            <p className="text-amber-700">Gather three worthy wizards for the ultimate quiz challenge</p>
          </div>

          <div className="space-y-6">
            {/* Team Name */}
            <div>
              <label className="block text-lg font-semibold text-amber-900 mb-2">Team Name</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter your team's magical name..."
                className="w-full px-4 py-3 rounded-lg border-2 border-amber-400 focus:border-amber-600 focus:outline-none bg-white/90 text-amber-900 placeholder-amber-500"
              />
            </div>

            {/* Students */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-900">Team Members</h3>
              {students.map((student, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-4 p-4 bg-white/50 rounded-lg border-2 border-amber-300">
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-1">
                      Student {index + 1} Name
                    </label>
                    <input
                      type="text"
                      value={student.name}
                      onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                      placeholder="Enter student name..."
                      className="w-full px-3 py-2 rounded border border-amber-400 focus:border-amber-600 focus:outline-none bg-white text-amber-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-1">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      value={student.rollNumber}
                      onChange={(e) => handleStudentChange(index, 'rollNumber', e.target.value)}
                      placeholder="Enter roll number..."
                      className="w-full px-3 py-2 rounded border border-amber-400 focus:border-amber-600 focus:outline-none bg-white text-amber-900"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Create Magical Team
            </button>
          </div>
        </div>

        {/* Teams List */}
        {teams.length > 0 && (
          <div className="mt-8 bg-white/80 p-6 rounded-lg shadow-xl border-2 border-amber-400">
            <h3 className="text-xl font-bold text-amber-900 mb-4">Created Teams ({teams.length})</h3>
            <div className="space-y-3">
              {teams.map((team) => (
                <div key={team.id} className="bg-amber-50 p-4 rounded-lg border border-amber-300">
                  <h4 className="font-bold text-amber-900 mb-2">{team.name} - Score: {team.score || 0}</h4>
                  <div className="grid md:grid-cols-3 gap-2 text-sm">
                    {team.students.map((student, index) => (
                      <div key={index} className="text-amber-700">
                        {student.name} ({student.rollNumber})
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Create Questions Page
const CreateQuestionsPage = ({ setCurrentRoute }) => {
  const { questions, setQuestions } = useAppContext();
  const [question, setQuestion] = useState('');
  const [code, setCode] = useState('');
  const [testCases, setTestCases] = useState('');
  const [expectedResult, setExpectedResult] = useState('');

  const handleSubmit = () => {
    if (question.trim() && code.trim() && testCases.trim() && expectedResult.trim()) {
      const newQuestion = {
        id: Date.now(),
        question: question,
        code: code,
        testCases: testCases,
        expectedResult: expectedResult
      };
      setQuestions([...questions, newQuestion]);
      setQuestion('');
      setCode('');
      setTestCases('');
      setExpectedResult('');
      alert('Question added to the magical tome!');
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => setCurrentRoute('home')}
          className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-blue-100 px-4 py-2 rounded-lg shadow-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
        <h1 className="text-4xl font-bold text-blue-900 font-serif">Create Questions</h1>
        <div></div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Form Card */}
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-8 rounded-lg shadow-2xl border-4 border-blue-600">
          <div className="text-center mb-6">
            <BookOpen className="w-16 h-16 text-blue-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Craft a Magical Question</h2>
            <p className="text-blue-700">Add your wisdom to the enchanted spellbook of knowledge</p>
          </div>

          <div className="space-y-6">
            {/* Question */}
            <div>
              <label className="block text-lg font-semibold text-blue-900 mb-2">Question Description</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your magical question here..."
                rows="3"
                className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:outline-none bg-white/90 text-blue-900 placeholder-blue-500 resize-none"
              />
            </div>

            {/* Code with Error */}
            <div>
              <label className="block text-lg font-semibold text-blue-900 mb-2">Code (with deliberate error)</label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code with a deliberate error for students to fix..."
                rows="6"
                className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:outline-none bg-gray-900 text-green-400 font-mono text-sm resize-none"
              />
            </div>

            {/* Test Cases */}
            <div>
              <label className="block text-lg font-semibold text-blue-900 mb-2">Test Cases</label>
              <textarea
                value={testCases}
                onChange={(e) => setTestCases(e.target.value)}
                placeholder="Enter test cases to validate the code..."
                rows="3"
                className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:outline-none bg-white/90 text-blue-900 placeholder-blue-500 resize-none"
              />
            </div>

            {/* Expected Result */}
            <div>
              <label className="block text-lg font-semibold text-blue-900 mb-2">Expected Result</label>
              <textarea
                value={expectedResult}
                onChange={(e) => setExpectedResult(e.target.value)}
                placeholder="Enter the expected result after fixing the code..."
                rows="2"
                className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:outline-none bg-white/90 text-blue-900 placeholder-blue-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Add to Spellbook
            </button>
          </div>
        </div>

        {/* Questions List */}
        {questions.length > 0 && (
          <div className="mt-8 bg-white/80 p-6 rounded-lg shadow-xl border-2 border-blue-400">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Spellbook Questions ({questions.length})</h3>
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={q.id} className="bg-blue-50 p-4 rounded-lg border border-blue-300">
                  <h4 className="font-bold text-blue-900 mb-2">Question {index + 1}: {q.question}</h4>
                  <div className="text-xs text-blue-700 space-y-1">
                    <div><strong>Code:</strong> {q.code.substring(0, 100)}...</div>
                    <div><strong>Test Cases:</strong> {q.testCases}</div>
                    <div><strong>Expected Result:</strong> {q.expectedResult}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Assign House Page (unchanged from original)
const AssignHousePage = ({ setCurrentRoute }) => {
  const { houseAssignments, setHouseAssignments } = useAppContext();
  const [rollNumber, setRollNumber] = useState('');
  const [selectedHouse, setSelectedHouse] = useState('');

  const houses = [
    { name: 'Gryffindor', color: 'from-red-600 to-red-800', icon: '🦁', description: 'Courage, bravery, nerve, and chivalry' },
    { name: 'Hufflepuff', color: 'from-yellow-600 to-yellow-800', icon: '🦡', description: 'Hard work, patience, loyalty, and fair play' },
    { name: 'Ravenclaw', color: 'from-blue-600 to-blue-800', icon: '🦅', description: 'Intelligence, knowledge, wit, and learning' },
    { name: 'Slytherin', color: 'from-green-600 to-green-800', icon: '🐍', description: 'Ambition, cunning, leadership, and resourcefulness' }
  ];

  const handleSubmit = () => {
    if (rollNumber.trim() && selectedHouse) {
      const existingIndex = houseAssignments.findIndex(assignment => assignment.rollNumber === rollNumber);
      const newAssignment = {
        id: Date.now(),
        rollNumber: rollNumber,
        house: selectedHouse
      };
      
      if (existingIndex >= 0) {
        const newAssignments = [...houseAssignments];
        newAssignments[existingIndex] = newAssignment;
        setHouseAssignments(newAssignments);
        alert(`Student ${rollNumber} has been re-sorted into ${selectedHouse}!`);
      } else {
        setHouseAssignments([...houseAssignments, newAssignment]);
        alert(`The Sorting Hat has spoken! Student ${rollNumber} belongs in ${selectedHouse}!`);
      }
      
      setRollNumber('');
      setSelectedHouse('');
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => setCurrentRoute('home')}
          className="flex items-center space-x-2 bg-purple-700 hover:bg-purple-800 text-purple-100 px-4 py-2 rounded-lg shadow-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
        <h1 className="text-4xl font-bold text-purple-900 font-serif">Assign House</h1>
        <div></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Form Card */}
        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-8 rounded-lg shadow-2xl border-4 border-purple-600 mb-8">
          <div className="text-center mb-6">
            <Wand2 className="w-16 h-16 text-purple-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-purple-900 mb-2">The Sorting Hat Ceremony</h2>
            <p className="text-purple-700 italic">"Oh, you may not think I'm pretty, but don't judge on what you see..."</p>
          </div>

          <div className="space-y-6">
            {/* Roll Number */}
            <div>
              <label className="block text-lg font-semibold text-purple-900 mb-2">Student Roll Number</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter student's roll number..."
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-400 focus:border-purple-600 focus:outline-none bg-white/90 text-purple-900 placeholder-purple-500"
              />
            </div>

            {/* House Selection */}
            <div>
              <label className="block text-lg font-semibold text-purple-900 mb-4">Choose Hogwarts House</label>
              <div className="grid md:grid-cols-2 gap-4">
                {houses.map((house) => (
                  <label key={house.name} className="cursor-pointer">
                    <input
                      type="radio"
                      name="house"
                      value={house.name}
                      checked={selectedHouse === house.name}
                      onChange={(e) => setSelectedHouse(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-6 rounded-lg shadow-lg border-4 transition-all duration-200 ${
                      selectedHouse === house.name 
                        ? `bg-gradient-to-br ${house.color} text-white border-yellow-400 transform scale-105` 
                        : 'bg-white border-gray-300 hover:border-gray-400'
                    }`}>
                      <div className="text-center">
                        <div className="text-4xl mb-2">{house.icon}</div>
                        <h3 className={`text-xl font-bold mb-2 ${
                          selectedHouse === house.name ? 'text-yellow-200' : 'text-gray-800'
                        }`}>
                          {house.name}
                        </h3>
                        <p className={`text-sm ${
                          selectedHouse === house.name ? 'text-yellow-100' : 'text-gray-600'
                        }`}>
                          {house.description}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Let the Sorting Hat Decide
            </button>
          </div>
        </div>

        {/* House Assignments List */}
        {houseAssignments.length > 0 && (
          <div className="bg-white/80 p-6 rounded-lg shadow-xl border-2 border-purple-400">
            <h3 className="text-xl font-bold text-purple-900 mb-4">House Assignments ({houseAssignments.length})</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'].map((houseName) => {
                const houseStudents = houseAssignments.filter(assignment => assignment.house === houseName);
                const house = houses.find(h => h.name === houseName);
                
                return (
                  <div key={houseName} className={`bg-gradient-to-br ${house.color} p-4 rounded-lg shadow-lg text-white`}>
                    <div className="text-center mb-3">
                      <div className="text-3xl mb-1">{house.icon}</div>
                      <h4 className="font-bold text-lg">{houseName}</h4>
                      <p className="text-sm text-yellow-200">({houseStudents.length} students)</p>
                    </div>
                    <div className="space-y-1">
                      {houseStudents.map((assignment) => (
                        <div key={assignment.id} className="text-sm bg-white/20 px-2 py-1 rounded">
                          Roll: {assignment.rollNumber}
                        </div>
                      ))}
                      {houseStudents.length === 0 && (
                        <p className="text-sm text-yellow-200 text-center italic">No students assigned</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Leaderboard Page
const LeaderboardPage = ({ setCurrentRoute }) => {
  const { teams } = useAppContext();
  
  // Sort teams by score in descending order
  const sortedTeams = [...teams].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => setCurrentRoute('home')}
          className="flex items-center space-x-2 bg-green-700 hover:bg-green-800 text-green-100 px-4 py-2 rounded-lg shadow-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
        <h1 className="text-4xl font-bold text-green-900 font-serif">Leaderboard</h1>
        <div></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Championship Header */}
        <div className="text-center mb-8">
          <Trophy className="w-20 h-20 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-green-900 mb-2">Triwizard Tournament</h2>
          <p className="text-green-700">Current Championship Standings</p>
        </div>

        {/* Leaderboard */}
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-8 rounded-lg shadow-2xl border-4 border-green-600">
          {sortedTeams.length > 0 ? (
            <div className="space-y-4">
              {sortedTeams.map((team, index) => (
                <div key={team.id} className={`p-6 rounded-lg shadow-lg border-2 transition-all duration-200 ${
                  index === 0 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 border-yellow-700 transform scale-105'
                    : index === 1
                    ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900 border-gray-600'
                    : index === 2
                    ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-orange-900 border-orange-700'
                    : 'bg-white border-green-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`text-3xl font-bold ${
                        index < 3 ? 'text-white' : 'text-green-900'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${
                          index < 3 ? 'text-white' : 'text-green-900'
                        }`}>
                          {team.name}
                        </h3>
                        <div className={`text-sm ${
                          index < 3 ? 'text-white/80' : 'text-green-700'
                        }`}>
                          {team.students.map(s => s.name).join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        index < 3 ? 'text-white' : 'text-green-900'
                      }`}>
                        {team.score || 0}
                      </div>
                      <div className={`text-sm ${
                        index < 3 ? 'text-white/80' : 'text-green-700'
                      }`}>
                        points
                      </div>
                    </div>
                  </div>
                  {index === 0 && (
                    <div className="mt-3 text-center">
                      <Crown className="w-8 h-8 text-yellow-200 mx-auto" />
                      <p className="text-yellow-100 font-semibold">Current Champion</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-900 mb-2">No Teams Registered</h3>
              <p className="text-green-700">Create some teams to see the leaderboard!</p>
            </div>
          )}
        </div>

        {/* Statistics */}
        {sortedTeams.length > 0 && (
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border border-green-300 text-center">
              <div className="text-2xl font-bold text-green-900">{sortedTeams.length}</div>
              <div className="text-green-700">Total Teams</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-green-300 text-center">
              <div className="text-2xl font-bold text-green-900">{Math.max(...sortedTeams.map(t => t.score || 0))}</div>
              <div className="text-green-700">Highest Score</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-green-300 text-center">
              <div className="text-2xl font-bold text-green-900">{Math.round(sortedTeams.reduce((sum, team) => sum + (team.score || 0), 0) / sortedTeams.length) || 0}</div>
              <div className="text-green-700">Average Score</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentRoute, setCurrentRoute] = useState('login');

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'login':
        return <LoginPage setCurrentRoute={setCurrentRoute} />;
      case 'create-teams':
        return <CreateTeamsPage setCurrentRoute={setCurrentRoute} />;
      case 'create-questions':
        return <CreateQuestionsPage setCurrentRoute={setCurrentRoute} />;
      case 'assign-house':
        return <AssignHousePage setCurrentRoute={setCurrentRoute} />;
      case 'leaderboard':
        return <LeaderboardPage setCurrentRoute={setCurrentRoute} />;
      default:
        return <HomePage setCurrentRoute={setCurrentRoute} />;
    }
  };

  return (
    <AppProvider>
      <Router currentRoute={currentRoute} setCurrentRoute={setCurrentRoute}>
        {renderCurrentPage()}
      </Router>
    </AppProvider>
  );
};

export default App;