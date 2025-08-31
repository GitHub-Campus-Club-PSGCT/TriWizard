import React, { useState, useEffect, createContext, useContext } from 'react';
import { ChevronLeft, Users, BookOpen, Home, Wand2, Star, Crown, Trophy, Plus, Minus, LogIn, LogOut, Send } from 'lucide-react';
import api from "./api";
// Context for global state management
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [houseAssignments, setHouseAssignments] = useState([]);
  
  // Load once from localStorage (or default to false)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem("isAuthenticated");
    return saved ? JSON.parse(saved) : false;
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  return (
    <AppContext.Provider
      value={{ teams, setTeams, questions, setQuestions, houseAssignments, setHouseAssignments, isAuthenticated, setIsAuthenticated }}
    >
      {children}
    </AppContext.Provider>
  );
};


const useAppContext = () => useContext(AppContext);

// Reusable UI Components
const WizardButton = ({ children, onClick, variant = 'primary', size = 'medium', disabled = false, className = '' }) => {
  const baseClasses = 'font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white',
    secondary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white',
    house: 'hover:border-yellow-400 transition-all duration-300'
  };

  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-6 py-3',
    large: 'px-8 py-4 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const WizardInput = ({ label, type = 'text', value, onChange, placeholder, required = false, className = '' }) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-800 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-lg border-2 border-amber-400 focus:border-amber-600 focus:outline-none bg-white text-gray-900 placeholder-gray-500"
      />
    </div>
  );
};

const WizardTextArea = ({ label, value, onChange, placeholder, rows = 3, required = false, className = '' }) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-800 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full px-4 py-3 rounded-lg border-2 border-amber-400 focus:border-amber-600 focus:outline-none bg-white text-gray-900 placeholder-gray-500 resize-none"
      />
    </div>
  );
};

const WizardCard = ({ children, className = '', theme = 'amber' }) => {
  const themes = {
    amber: 'from-amber-100 to-yellow-100 border-amber-600',
    blue: 'from-blue-100 to-indigo-100 border-blue-600',
    purple: 'from-purple-100 to-indigo-100 border-purple-600',
    green: 'from-green-100 to-emerald-100 border-green-600'
  };

  return (
    <div className={`bg-gradient-to-br ${themes[theme]} p-8 rounded-lg shadow-2xl border-4 ${className}`}>
      {children}
    </div>
  );
};

const ParchmentBackground = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-red-400 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 bg-green-400 rounded-full animate-bounce"></div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/30 via-amber-100/20 to-orange-200/30 backdrop-blur-sm"></div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Navigation Menu Component
const NavigationMenu = ({ currentRoute, setCurrentRoute, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { route: 'home', label: 'Dashboard', icon: Home, color: 'amber' },
    { route: 'create-teams', label: 'Create Teams', icon: Users, color: 'red' },
    { route: 'create-questions', label: 'Create Questions', icon: BookOpen, color: 'blue' },
    { route: 'assign-house', label: 'Assign House', icon: Wand2, color: 'purple' },
    { route: 'leaderboard', label: 'Leaderboard', icon: Trophy, color: 'green' }
  ];

  return (
    <>
      <nav className="hidden lg:flex bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 p-4 shadow-2xl border-b-4 border-yellow-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <Crown className="w-8 h-8 text-yellow-200" />
            <span className="text-2xl font-bold text-yellow-100 font-serif">Hogwarts Admin</span>
          </div>

          <div className="flex space-x-6">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentRoute === item.route;
              
              return (
                <button
                  key={item.route}
                  onClick={() => setCurrentRoute(item.route)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-yellow-600 text-yellow-100 shadow-lg transform scale-105' 
                      : 'text-yellow-200 hover:bg-yellow-700/50 hover:text-yellow-100'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          <WizardButton variant="danger" size="small" onClick={onLogout}>
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </WizardButton>
        </div>
      </nav>

      <nav className="lg:hidden bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 p-4 shadow-2xl border-b-4 border-yellow-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="w-6 h-6 text-yellow-200" />
            <span className="text-lg font-bold text-yellow-100 font-serif">Hogwarts</span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-yellow-200 hover:text-yellow-100 p-2"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className={`h-0.5 bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`h-0.5 bg-current transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`h-0.5 bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
          </button>
        </div>

        {isMenuOpen && (
          <div className="mt-4 space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentRoute === item.route;
              
              return (
                <button
                  key={item.route}
                  onClick={() => {
                    setCurrentRoute(item.route);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-yellow-600 text-yellow-100 shadow-lg' 
                      : 'text-yellow-200 hover:bg-yellow-700/50 hover:text-yellow-100'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            
            <button
              onClick={() => {
                onLogout();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-700/50 hover:text-red-100 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

// Page Layout Component
const PageLayout = ({ children, currentRoute, setCurrentRoute, showNavigation = true, showBackButton = true }) => {
  const { setIsAuthenticated } = useAppContext();

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentRoute('login');
  };

  const handleBackClick = () => {
    setCurrentRoute('home');
  };

  return (
    <ParchmentBackground>
      {showNavigation && (
        <NavigationMenu 
          currentRoute={currentRoute} 
          setCurrentRoute={setCurrentRoute}
          onLogout={handleLogout}
        />
      )}
      {showBackButton && currentRoute !== 'home' && (
        <div className="p-4">
          <WizardButton
            variant="secondary"
            size="small"
            onClick={handleBackClick}
            className="mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </WizardButton>
        </div>
      )}
      {children}
    </ParchmentBackground>
  );
};

// Backend Integration Service (simulated)
const BackendService = {
  adjustTeamScore: async (teamId, scoreAdjustment) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (teamId && scoreAdjustment !== undefined) {
          console.log(`POST /api/teams/${teamId}/score`, { adjustment: scoreAdjustment });
          resolve({ success: true, message: 'Score updated successfully' });
        } else {
          reject({ error: 'Invalid team ID or score value' });
        }
      }, 1000);
    });
  }
};

// Login Page
const LoginPage = ({ setCurrentRoute }) => {
  const { setIsAuthenticated } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

 const handleLogin = () => {
  if (username === 'ghccadmin' && password === 'ghcc@25') {
    setIsAuthenticated(true);
    setCurrentRoute('home');
  } else {
    alert('Invalid username or password!');
  }
};


  return (
    <ParchmentBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <WizardCard theme="purple">
            <div className="text-center mb-6">
              <Crown className="w-16 h-16 text-purple-700 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-purple-900 mb-2 font-serif">Admin Portal</h1>
              <p className="text-purple-700">Enter the secret passage to Hogwarts administration</p>
            </div>

            <div className="space-y-4">
              <WizardInput
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username..."
                required
              />

              <WizardInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                required
              />

              <WizardButton
                variant="secondary"
                size="large"
                onClick={handleLogin}
                className="w-full"
              >
                <LogIn className="w-5 h-5" />
                <span>Enter Hogwarts</span>
              </WizardButton>
            </div>
          </WizardCard>
        </div>
      </div>
    </ParchmentBackground>
  );
};

// Main Dashboard Page
const HomePage = ({ setCurrentRoute }) => {
  const { teams, setTeams, questions } = useAppContext();
  const [teamId, setTeamId] = useState('');
  const [scoreValue, setScoreValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScoreAdjustment = async () => {
    if (!teamId.trim() || !scoreValue.trim()) {
      alert('Please enter both Team ID and Score Value');
      return;
    }

    const scoreAdjustment = parseInt(scoreValue);
    if (isNaN(scoreAdjustment)) {
      alert('Score value must be a number');
      return;
    }

    setIsSubmitting(true);
    try {
      await BackendService.adjustTeamScore(teamId, scoreAdjustment);
      
      setTeams(teams.map(team => 
        team.id.toString() === teamId 
          ? { ...team, score: Math.max(0, (team.score || 0) + scoreAdjustment) }
          : team
      ));

      setTeamId('');
      setScoreValue('');
      alert(`Score adjustment sent successfully! Added ${scoreAdjustment} points to Team ID: ${teamId}`);
    } catch (error) {
      alert(`Error: ${error.error || 'Failed to update score'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-8 text-center">
          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-600">
            <Crown className="w-16 h-16 text-yellow-200" />
          </div>
          <h1 className="text-6xl font-bold text-amber-900 mb-2 tracking-wider font-serif">
            HOGWARTS
          </h1>
          <h2 className="text-3xl font-semibold text-amber-800 mb-4">Admin Page</h2>
          <p className="text-lg text-amber-700 italic">"Draco dormiens nunquam titillandus"</p>
        </div>

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

        <div className="w-full max-w-4xl h-2 bg-gradient-to-r from-red-600 via-blue-600 via-yellow-500 to-green-600 rounded-full mb-8"></div>

        <div className="grid md:grid-cols-4 gap-6 w-full max-w-6xl mb-8">
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

        <div className="w-full max-w-4xl mb-8">
          <WizardCard>
            <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">Score Management</h3>
            <p className="text-amber-700 text-center mb-6">Enter Team ID and Score Value to adjust team scores via backend</p>
            
            <div className="grid md:grid-cols-3 gap-4 items-end">
              <WizardInput
                label="Team ID"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                placeholder="Enter team ID..."
                required
              />
              
              <WizardInput
                label="Score Value"
                type="number"
                value={scoreValue}
                onChange={(e) => setScoreValue(e.target.value)}
                placeholder="Enter score (+ or -)..."
                required
              />
              
              <WizardButton
                variant="success"
                onClick={handleScoreAdjustment}
                disabled={isSubmitting}
                className="h-12"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Adjust Score</span>
                  </>
                )}
              </WizardButton>
            </div>
            
            <div className="mt-6 text-xs text-amber-600 bg-amber-50 p-3 rounded">
              <strong>Note:</strong> This sends a POST request to the backend with Team ID and score adjustment value.
              Positive values add points, negative values subtract points.
            </div>
          </WizardCard>
        </div>

        {teams.length > 0 && (
          <div className="w-full max-w-4xl">
            <div className="bg-white/80 p-6 rounded-lg shadow-xl border-2 border-amber-400">
              <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">Registered Teams</h3>
              <div className="space-y-3">
                {teams.map((team) => (
                  <div key={team.id} className="bg-amber-50 p-4 rounded-lg border border-amber-300 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-amber-900">ID: {team.id} - {team.name}</h4>
                      <div className="text-sm text-amber-700">Score: {team.score || 0}</div>
                      <div className="text-xs text-amber-600">
                        Members: {team.students.map(s => s.name).join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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

// Teams Page
const TeamsPage = ({ setCurrentRoute }) => {
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

  const handleSubmit = async () => {
  if (teamName.trim() && students.every(s => s.name.trim() && s.rollNumber.trim())) {
    const newTeam = {
      teamName: teamName,
      members: students.map(s => ({
        rollNumber: s.rollNumber,
        name: s.name
      }))
    };

    try {
      const response = await api.post("/admin", newTeam);
      setTeams([...teams, response.data]); 
      alert("Team created successfully!");
      setCurrentRoute("home");
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team");
    }

    setTeamName("");
    setStudents([
      { name: "", rollNumber: "" },
      { name: "", rollNumber: "" },
      { name: "", rollNumber: "" }
    ]);
  } else {
    alert("Please fill in all fields");
  }
};

  return (
    <div className="min-h-screen p-6 pt-2">
      <div className="max-w-2xl mx-auto">
        <WizardCard>
          <div className="text-center mb-6">
            <Users className="w-16 h-16 text-amber-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Assemble Your Magical Team</h2>
            <p className="text-amber-700">Gather three worthy wizards for the ultimate quiz challenge</p>
          </div>

          <div className="space-y-6">
            <WizardInput
              label="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team's magical name..."
              required
            />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-900">Team Members</h3>
              {students.map((student, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-4 p-4 bg-white/50 rounded-lg border-2 border-amber-300">
                  <WizardInput
                    label={`Student ${index + 1} Name`}
                    value={student.name}
                    onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                    placeholder="Enter student name..."
                    required
                  />
                  <WizardInput
                    label="Roll Number"
                    value={student.rollNumber}
                    onChange={(e) => handleStudentChange(index, 'rollNumber', e.target.value)}
                    placeholder="Enter roll number..."
                    required
                  />
                </div>
              ))}
            </div>

            <WizardButton onClick={handleSubmit} size="large" className="w-full">
              Create Magical Team
            </WizardButton>
          </div>
        </WizardCard>

        {teams.length > 0 && (
          <div className="mt-8 bg-white/80 p-6 rounded-lg shadow-xl border-2 border-amber-400">
            <h3 className="text-xl font-bold text-amber-900 mb-4">Created Teams ({teams.length})</h3>
            <div className="space-y-3">
              {teams.map((team) => (
                <div key={team.id} className="bg-amber-50 p-4 rounded-lg border border-amber-300">
                  <h4 className="font-bold text-amber-900 mb-2">ID: {team.id} - {team.name} - Score: {team.score || 0}</h4>
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

// Questions Page
const QuestionsPage = ({ setCurrentRoute }) => {
  const { questions, setQuestions } = useAppContext();
  const [question, setQuestion] = useState('');
  const [code, setCode] = useState('');
  const [testCases, setTestCases] = useState('');
  const [expectedResult, setExpectedResult] = useState('');


const handleSubmit = async () => {
  if (!question.trim() || !code.trim() || !testCases.trim() || !expectedResult.trim()) {
    alert('Please fill in all fields');
    return;
  }

  const newQuestion = {
    question,
    code,
    testCases,
    expectedResult
  };

  try {
    const res = await api.post("/admin-question", newQuestion);
    setQuestions([...questions, res.data]); 
    setQuestion('');
    setCode('');
    setTestCases('');
    setExpectedResult('');
    alert('Question added to the magical tome!');
  } catch (err) {
    console.error("Error adding question:", err);
    alert('Failed to add question, check console for details.');
  }
};



  return (
    <div className="min-h-screen p-6 pt-2">
      <div className="max-w-3xl mx-auto">
        <WizardCard theme="blue">
          <div className="text-center mb-6">
            <BookOpen className="w-16 h-16 text-blue-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Craft a Magical Question</h2>
            <p className="text-blue-700">Add your wisdom to the enchanted spellbook of knowledge</p>
          </div>

          <div className="space-y-6">
            <WizardTextArea
              label="Question Description"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your magical question here..."
              rows={3}
              required
            />

            <WizardTextArea
              label="Code (with deliberate error)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code with a deliberate error for students to fix..."
              rows={6}
              required
              className="font-mono"
            />

            <WizardTextArea
              label="Test Cases"
              value={testCases}
              onChange={(e) => setTestCases(e.target.value)}
              placeholder="Enter test cases to validate the code..."
              rows={3}
              required
            />

            <WizardTextArea
              label="Expected Result"
              value={expectedResult}
              onChange={(e) => setExpectedResult(e.target.value)}
              placeholder="Enter the expected result after fixing the code..."
              rows={2}
              required
            />

            <WizardButton variant="secondary" onClick={handleSubmit} size="large" className="w-full">
              Add to Spellbook
            </WizardButton>
          </div>
        </WizardCard>

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

// House Assignment Page
const HousePage = ({ setCurrentRoute }) => {
  const { houseAssignments, setHouseAssignments } = useAppContext();
  const [rollNumber, setRollNumber] = useState('');
  const [selectedHouse, setSelectedHouse] = useState('');

  const houses = [
    { name: 'Gryffindor', color: 'from-red-600 to-red-800', icon: '🦁', description: 'Courage, bravery, nerve, and chivalry' },
    { name: 'Hufflepuff', color: 'from-yellow-600 to-yellow-800', icon: '🦡', description: 'Hard work, patience, loyalty, and fair play' },
    { name: 'Ravenclaw', color: 'from-blue-600 to-blue-800', icon: '🦅', description: 'Intelligence, knowledge, wit, and learning' },
    { name: 'Slytherin', color: 'from-green-600 to-green-800', icon: '🐍', description: 'Ambition, cunning, leadership, and resourcefulness' }
  ];

const handleHouseSubmit = async (e) => {
  e.preventDefault(); // stop page reload
  if (!rollNumber.trim() || !selectedHouse) {
    alert("Please fill in all fields");
    return;
  }

  const payload = {
    rollNumber: Number(rollNumber),
    houseName: selectedHouse
  };

  console.log("Sending PATCH /admin/house", payload);

  try {
    const res = await api.patch("/admin/house", payload);
    console.log("Frontend got response:", res.status, res.data);
    alert(`Assigned ${payload.rollNumber} to ${payload.houseName}`);
  } catch (err) {
    console.error("Error assigning house:", err);
    alert("Failed to assign house");
  }
};

  return (
    <div className="min-h-screen p-6 pt-2">
      <div className="max-w-4xl mx-auto">
        <WizardCard theme="purple" className="mb-8">
          <div className="text-center mb-6">
            <Wand2 className="w-16 h-16 text-purple-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-purple-900 mb-2">The Sorting Hat Ceremony</h2>
            <p className="text-purple-700 italic">"Oh, you may not think I'm pretty, but don't judge on what you see..."</p>
          </div>

          <div className="space-y-6">
            <WizardInput
              label="Student Roll Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="Enter student's roll number..."
              required
            />

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

            <button
  type="button"
  onClick={handleHouseSubmit}
  className="w-full bg-purple-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-purple-800 transition"
>
  Let the Sorting Hat Decide
</button>
          </div>
        </WizardCard>

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
  const sortedTeams = [...teams].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="min-h-screen p-6 pt-2">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Trophy className="w-20 h-20 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-green-900 mb-2">Triwizard Tournament</h2>
          <p className="text-green-700">Current Championship Standings</p>
        </div>

        <WizardCard theme="green">
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
                          {team.name} (ID: {team.id})
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
        </WizardCard>

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
        return (
          <PageLayout currentRoute="create-teams" setCurrentRoute={setCurrentRoute}>
            <TeamsPage setCurrentRoute={setCurrentRoute} />
          </PageLayout>
        );
      case 'create-questions':
        return (
          <PageLayout currentRoute="create-questions" setCurrentRoute={setCurrentRoute}>
            <QuestionsPage setCurrentRoute={setCurrentRoute} />
          </PageLayout>
        );
      case 'assign-house':
        return (
          <PageLayout currentRoute="assign-house" setCurrentRoute={setCurrentRoute}>
            <HousePage setCurrentRoute={setCurrentRoute} />
          </PageLayout>
        );
      case 'leaderboard':
        return (
          <PageLayout currentRoute="leaderboard" setCurrentRoute={setCurrentRoute}>
            <LeaderboardPage setCurrentRoute={setCurrentRoute} />
          </PageLayout>
        );
      default:
        return (
          <PageLayout currentRoute="home" setCurrentRoute={setCurrentRoute}>
            <HomePage setCurrentRoute={setCurrentRoute} />
          </PageLayout>
        );
    }
  };

  return (
    <AppProvider>
      {renderCurrentPage()}
    </AppProvider>
  );
};

export default App;