import React, { useState, createContext, useContext } from 'react';
import { ChevronLeft, Users, BookOpen, Home, Wand2, Star, Crown } from 'lucide-react';

// Context for global state management
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [houseAssignments, setHouseAssignments] = useState([]);

  return (
    <AppContext.Provider value={{
      teams, setTeams,
      questions, setQuestions,
      houseAssignments, setHouseAssignments
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

// Main Landing Page
const HomePage = ({ setCurrentRoute }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Hogwarts Crest */}
      <div className="mb-8 text-center">
        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-600">
          <Crown className="w-16 h-16 text-yellow-200" />
        </div>
        <h1 className="text-6xl font-bold text-amber-900 mb-2 tracking-wider font-serif">
          HOGWARTS
        </h1>
        <p className="text-lg text-amber-700 italic">"Draco dormiens nunquam titillandus"</p>
      </div>

      {/* House Colors Border */}
      <div className="w-full max-w-4xl h-2 bg-gradient-to-r from-red-600 via-blue-600 via-yellow-500 to-green-600 rounded-full mb-8"></div>

      {/* Navigation Cards */}
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-4xl">
        {/* Create Teams */}
        <div 
          onClick={() => setCurrentRoute('create-teams')}
          className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
        >
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 rounded-lg shadow-2xl border-4 border-yellow-600 hover:border-yellow-400">
            <div className="text-center">
              <Users className="w-16 h-16 text-yellow-200 mx-auto mb-4 group-hover:animate-bounce" />
              <h3 className="text-2xl font-bold text-yellow-100 mb-2">Create Teams</h3>
              <p className="text-yellow-200 text-sm">Assemble your magical teams for the ultimate quiz challenge</p>
            </div>
          </div>
        </div>

        {/* Create Questions */}
        <div 
          onClick={() => setCurrentRoute('create-questions')}
          className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
        >
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-lg shadow-2xl border-4 border-yellow-600 hover:border-yellow-400">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-yellow-200 mx-auto mb-4 group-hover:animate-bounce" />
              <h3 className="text-2xl font-bold text-yellow-100 mb-2">Create Questions</h3>
              <p className="text-yellow-200 text-sm">Craft mystical questions worthy of the greatest wizards</p>
            </div>
          </div>
        </div>

        {/* Assign House */}
        <div 
          onClick={() => setCurrentRoute('assign-house')}
          className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
        >
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-8 rounded-lg shadow-2xl border-4 border-yellow-600 hover:border-yellow-400">
            <div className="text-center">
              <Wand2 className="w-16 h-16 text-yellow-200 mx-auto mb-4 group-hover:animate-bounce" />
              <h3 className="text-2xl font-bold text-yellow-100 mb-2">Assign House</h3>
              <p className="text-yellow-200 text-sm">Let the Sorting Hat decide each student's destiny</p>
            </div>
          </div>
        </div>
      </div>

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
        students: students
      };
      setTeams([...teams, newTeam]);
      setTeamName('');
      setStudents([
        { name: '', rollNumber: '' },
        { name: '', rollNumber: '' },
        { name: '', rollNumber: '' }
      ]);
      alert('Team created successfully! ✨');
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
              ✨ Create Magical Team ✨
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
                  <h4 className="font-bold text-amber-900 mb-2">{team.name}</h4>
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

// Create Questions Page
const CreateQuestionsPage = ({ setCurrentRoute }) => {
  const { questions, setQuestions } = useAppContext();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (question.trim() && options.every(opt => opt.trim()) && correctAnswer.trim()) {
      const newQuestion = {
        id: Date.now(),
        question: question,
        options: options,
        correctAnswer: correctAnswer
      };
      setQuestions([...questions, newQuestion]);
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
      alert('Question added to the magical tome! 📚✨');
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
              <label className="block text-lg font-semibold text-blue-900 mb-2">Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your magical question here..."
                rows="3"
                className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:outline-none bg-white/90 text-blue-900 placeholder-blue-500 resize-none"
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-lg font-semibold text-blue-900 mb-2">Answer Options</label>
              <div className="grid md:grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Option {String.fromCharCode(65 + index)}
                    </label>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Enter option ${String.fromCharCode(65 + index)}...`}
                      className="w-full px-3 py-2 rounded border border-blue-400 focus:border-blue-600 focus:outline-none bg-white text-blue-900"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Correct Answer */}
            <div>
              <label className="block text-lg font-semibold text-blue-900 mb-2">Correct Answer</label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:outline-none bg-white text-blue-900"
              >
                <option value="">Select the correct answer...</option>
                {options.map((option, index) => (
                  <option key={index} value={option} disabled={!option.trim()}>
                    {String.fromCharCode(65 + index)}: {option || 'Empty'}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              📚 Add to Spellbook 📚
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
                  <div className="grid md:grid-cols-2 gap-2 text-sm mb-2">
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className={`text-blue-700 ${opt === q.correctAnswer ? 'font-bold text-green-700' : ''}`}>
                        {String.fromCharCode(65 + optIndex)}: {opt} {opt === q.correctAnswer ? '✓' : ''}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-green-700 font-semibold">Correct Answer: {q.correctAnswer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Assign House Page
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
        alert(`Student ${rollNumber} has been re-sorted into ${selectedHouse}! 🎭✨`);
      } else {
        setHouseAssignments([...houseAssignments, newAssignment]);
        alert(`The Sorting Hat has spoken! Student ${rollNumber} belongs in ${selectedHouse}! 🎭✨`);
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
              🎭 Let the Sorting Hat Decide 🎭
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

// Main App Component
const App = () => {
  const [currentRoute, setCurrentRoute] = useState('home');

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'create-teams':
        return <CreateTeamsPage setCurrentRoute={setCurrentRoute} />;
      case 'create-questions':
        return <CreateQuestionsPage setCurrentRoute={setCurrentRoute} />;
      case 'assign-house':
        return <AssignHousePage setCurrentRoute={setCurrentRoute} />;
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