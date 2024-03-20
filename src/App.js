import React, { useState,useEffect } from 'react';
import './App.css'; 
import chatSvg from './Images/message.png';
import renamesvg from './Images/pen.png';
import deleteSvg from './Images/delete.png';
import vectorpng from './Images/usericon.png';
import vectorpng1 from './Images/res1.png';
import fileup from './Images/Vector (1).png';
import sendBtn from './Images/send11.png';
import vector1 from './Images/resicon.png';
import edit1 from './Images/Vector (3).png';
import regeneratepng from './Images/Vector (4).png';
import micro from './Images/cxp logo.png';
import RightSidebar from './RightSidebar';
import Bookpng from './Images/book.png';
import { ThreeDots } from 'react-loader-spinner';
import ConfirmationDialog from './ConfirmationDialog';
import del2png from './Images/delete1.png';
const App = () => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [file, setFile] = useState(null);
  const [editSessionId, setEditSessionId] = useState(null);
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [showSampleCards, setShowSampleCards] = useState(false);
  const [frequentlyAskedQuestions, setFrequentlyAskedQuestions] = useState([]);
  const [sessionCounter, setSessionCounter] = useState(1);  
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [inputValue, setInputValue] = useState(''); 
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [showFullResponse, setShowFullResponse] = useState(false); 
  const [previousResponseLoading, setPreviousResponseLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedMessageIndex, setEditedMessageIndex] = useState(null);



  const resetEditQuestionState = () => {
    setIsEditMode(false);
    setEditedQuestion('');
    setEditedMessageIndex(null);
  };

  const toggleEditQuestion = (index, question) => {
    setIsEditMode(!isEditMode);
    setEditedQuestion(question);
    setEditedMessageIndex(index);
    if (!isEditMode) {
      const contentEditableDiv = document.getElementById(`editableQuestion-${index}`);
      if (contentEditableDiv) {
        contentEditableDiv.focus();
      }
    }
  };
  

  const openConfirmationDialog = () => {
    setIsConfirmationDialogOpen(true);
  };

  const closeConfirmationDialog = () => {
    setIsConfirmationDialogOpen(false);
  };

  const handleConfirmDeleteAllSessions = () => {
    deleteAllSessions();
    closeConfirmationDialog();
  };


  const initialQuestions = [
    'For those that are somewhat dissatisfied or very dissatisfied for Brand Assigned Clouds, what are the top pain points across all 3 clouds? ',
    'why people are shifting to azure?',
    'what are the pain points of azure?',
    'give me the list of not satisfied responses in azure csat?',
  ];
  const toggleChatSidebar = () => {
    setIsChatSidebarOpen((prevIsChatSidebarOpen) => !prevIsChatSidebarOpen);
  };
  const toggleRightSidebar = () => {
    setIsRightSidebarOpen((prevIsRightSidebarOpen) => !prevIsRightSidebarOpen);
  };
 
  const handleSessionClick = (session) => {
    setEditSessionId(null);
    setCurrentSession(session); 
    resetEditQuestionState();
  };

  const toggleEditSession = (sessionID) => {
    setEditSessionId((prevEditSessionId) =>
      prevEditSessionId === sessionID ? null : sessionID
    );
  };

  const handleKeyDown = (event, sessionID) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      toggleEditSession(sessionID);
      saveSessions(sessions);
    }
  };
  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem('sessions')) || [];
    setSessions(savedSessions);
    setSessionCounter(savedSessions.length + 1);

    if (savedSessions.length === 0) {
      createSession();
    }

    setFrequentlyAskedQuestions(initialQuestions);
    const lastViewedSessionID = parseInt(localStorage.getItem('lastViewedSessionID'), 10);
    if (lastViewedSessionID) {
      const lastViewedSession = savedSessions.find(session => session.id === lastViewedSessionID);
      if (lastViewedSession) {
        setCurrentSession(lastViewedSession);
      }
    }
  }, []);

  useEffect(() => {
    if (currentSession) {
      setText('');
      localStorage.setItem('lastViewedSessionID', currentSession.id.toString());
    }
  }, [currentSession]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const createSession = () => {
    // const uniqueNumber = Math.floor(Math.random() * 90) + 10;
    const newSession = {
      id: sessionCounter,
      work: 0,
    };
    setSessions((prevSessions) => [...prevSessions, newSession]);
    setSessionCounter((prevCounter) => prevCounter + 1);
    setCurrentSession(newSession);
    setShowSampleCards(true);
  };

  const updateWorkInSession = (amount) => {
    if (currentSession) {
      const updatedSessions = sessions.map((session) =>
        session.id === currentSession.id ? { ...session, work: session.work + amount } : session
      );
      setSessions(updatedSessions);
      saveSessions(updatedSessions);
    }
  };

  
  const deleteSession = (sessionID) => {
    const updatedSessions = sessions.filter((session) => session.id !== sessionID);
    setSessions(updatedSessions);
    saveSessions(updatedSessions);
    localStorage.removeItem(`messages-${sessionID}`);
    setCurrentSession(null);
  };

  const saveSessions = (updatedSessions) => {
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));
  };

  const saveMessages = (sessionID, messages) => {
    localStorage.setItem(`messages-${sessionID}`, JSON.stringify(messages));
  };

  const loadMessages = (sessionID) => {
    return JSON.parse(localStorage.getItem(`messages-${sessionID}`)) || [];
  };
  const setRecentQuestions = (newQuestion) => {
    setFrequentlyAskedQuestions((prevQuestions) => {
      const updatedQuestions = [newQuestion, ...prevQuestions];
      const questionFrequency = {};
      updatedQuestions.forEach((question) => {
        questionFrequency[question] = (questionFrequency[question] || 0) + 1;
      });
      const sortedQuestions = Object.keys(questionFrequency).sort(
        (a, b) => questionFrequency[b] - questionFrequency[a]
      );
      const topFourQuestions = sortedQuestions.slice(0, 4);
  
      return topFourQuestions;
    });
  };
  const handleCancelEdit = () => {
    resetEditQuestionState();
  };
  

  const handleEditSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const sessionID = currentSession.id;

      const updatedMessages = messages.map((message, index) => {
        if (index === editedMessageIndex && isEditMode) {
          return {
            ...message,
            text: editedQuestion,
            isLoading: true,
            response: '',
          };
        }
        return message;
      });

      saveMessages(sessionID, updatedMessages);
      setCurrentSession({ ...currentSession, messages: updatedMessages });

      const formData = new FormData();
      formData.append('text', editedQuestion);

      const apiResponse = await fetch('http://20.121.131.26:8000/proto/', {
        method: 'POST',
        body: formData,
        
      });

      if (apiResponse.ok) {
        const data = await apiResponse.json();

        const updatedMessagesAfterEdit = updatedMessages.map((message, index) => {
          if (index === editedMessageIndex) {
            return {
              ...message,
              response: data.response,
              isLoading: false,
              showFullResponse: true,
            };
          }
          return message;
        });

        saveMessages(sessionID, updatedMessagesAfterEdit);
        setCurrentSession({ ...currentSession, messages: updatedMessagesAfterEdit });

        setRecentQuestions(editedQuestion);
      } else {
        console.error('Server error: Unexpected status code ' + apiResponse.status);
        setError('Server error: Unexpected status code ' + apiResponse.status);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error fetching data. Please try again.');
    } finally {
      resetEditQuestionState();
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!text) {
        setError('Please enter a question.');
        return;
      }
      if (messages.length > 0 && messages[messages.length - 1].isLoading) {
        alert('Previous response is still loading. Please wait.');
        return;
      }

      const newMessage = { text, response: '', isAnswer: true, isLoading: true, showFullResponse: false };

      if (currentSession) {
        const sessionID = currentSession.id;

        const updatedMessages = [...loadMessages(sessionID), newMessage];
        saveMessages(sessionID, updatedMessages);
        setCurrentSession({ ...currentSession, messages: updatedMessages });
        updateWorkInSession(1);

        setText('');

        const formData = new FormData();
        formData.append('text', text);

        const apiResponse = await fetch('http://20.121.131.26:8000/proto/', {
          method: 'POST',
          body: formData,
        });

        if (apiResponse.ok) {
          const data = await apiResponse.json();

          const updatedMessages = loadMessages(sessionID).map((message) =>
            message.text === text
              ? { ...message, response: data.response, isLoading: false }
              : message
          );

          saveMessages(sessionID, updatedMessages);
          setCurrentSession({ ...currentSession, messages: updatedMessages });
          updateWorkInSession(1);

          setTimeout(() => {
            const updatedMessagesAfterDelay = updatedMessages.map((message) =>
              message.text === text ? { ...message, showFullResponse: true } : message
            );

            saveMessages(sessionID, updatedMessagesAfterDelay);
            setCurrentSession({ ...currentSession, messages: updatedMessagesAfterDelay });
          }, 3000);

          setRecentQuestions(text);
        } else {
          console.error('Server error: Unexpected status code ' + apiResponse.status);
          setError('Server error: Unexpected status code ' + apiResponse.status);
          const updatedMessages = loadMessages(sessionID).map((message) =>
            message.text === text ? { ...message, isLoading: false } : message
          );
          saveMessages(sessionID, updatedMessages);
          setCurrentSession({ ...currentSession, messages: updatedMessages });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error fetching data. Please try again.');
      const updatedMessages = loadMessages(currentSession.id).map((message) =>
        message.text === text ? { ...message, isLoading: false } : message
      );
      saveMessages(currentSession.id, updatedMessages);
      setCurrentSession({ ...currentSession, messages: updatedMessages });
    }
  };
   
  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const messages = currentSession ? loadMessages(currentSession.id) || [] : [];

  const deleteAllSessions = () => {
    setSessions([]);
    saveSessions([]);
    setCurrentSession(null);
    localStorage.clear();
  };

  // const renameSession = (sessionID) => {
  //   const newSessionName = prompt('Enter new session name:');

  //   if (newSessionName !== null && newSessionName !== '') {
  //     const updatedSessions = sessions.map((session) =>
  //       session.id === sessionID ? { ...session, name: newSessionName } : session
  //     );

  //     setSessions(updatedSessions);
  //     saveSessions(updatedSessions);
  //   }
  // };


  // const handleNewChat = () => {
  //   setChats([...chats, { id: chats.length + 1, content: 'New Chat' }]);
  // };

  // const toggleEditMode = (chatId) => {
  //   setChats((prevChats) =>
  //     prevChats.map((chat) =>
  //       chat.id === chatId ? { ...chat, isEditing: !chat.isEditing } : chat
  //     )
  //   );
  // };

  // const saveChanges = (chatId) => {
  //   setChats((prevChats) =>
  //     prevChats.map((chat) =>
  //       chat.id === chatId ? { ...chat, isEditing: false } : chat
  //     )
  //   );
  // };
  const regenerateResponse = async () => {
    setIsLoading(true);
    setError('');
  
    try {
      if (!currentSession) {
        setError('No active session');
        return;
      }
      if (messages.length > 0 && messages[messages.length - 1].isLoading) {
        alert('Previous response is still loading. Please wait.');
        setIsLoading(false);
        return;
      }
  
      const lastQuestion = messages.length > 0 ? messages[messages.length - 1].text : '';
      const newMessage = { text: lastQuestion, response: 'Loading...', isAnswer: true, isLoading: true };
      const sessionID = currentSession.id;
      const updatedMessages = [...loadMessages(sessionID), newMessage];
      saveMessages(sessionID, updatedMessages);
      setCurrentSession({ ...currentSession, messages: updatedMessages });
      updateWorkInSession(1);
  
      const formData = new FormData();
      formData.append('text', lastQuestion);
  
      const apiResponse = await fetch('http://20.121.131.26:8000/proto/', {
        method: 'POST',
        body: formData,
      });
  
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        const updatedMessages = loadMessages(sessionID).map((message) =>
          message.text === lastQuestion
            ? { ...message, response: data.response, isLoading: false }
            : message
        );
  
        saveMessages(sessionID, updatedMessages);
        setCurrentSession({ ...currentSession, messages: updatedMessages });
        updateWorkInSession(1);
  
        setTimeout(() => {
          const updatedMessagesAfterDelay = updatedMessages.map((message) =>
            message.text === lastQuestion ? { ...message, showFullResponse: true } : message
          );
  
          saveMessages(sessionID, updatedMessagesAfterDelay);
          setCurrentSession({ ...currentSession, messages: updatedMessagesAfterDelay });
        }, 3000);
      } else {
        console.error('Server error: Unexpected status code ' + apiResponse.status);
        setError('Server error: Unexpected status code ' + apiResponse.status);
        const updatedMessages = loadMessages(sessionID).map((message) =>
          message.text === lastQuestion ? { ...message, isLoading: false } : message
        );
        saveMessages(sessionID, updatedMessages);
        setCurrentSession({ ...currentSession, messages: updatedMessages });
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const handleRegenerateClick = () => {
    regenerateResponse();
  };
  // const SampleCard = ({ content }) => {
  //   return (
  //     <div className="sample-card">
  //       <img className='icon' src={Bookpng} alt='Bookpng' />
  //       <p>{content}</p>
  //     </div>
  //   );
  // };
  const handleQuestionClick = async (question) => {
    setIsLoading(true);
    setError('');
  
    try {
      if (messages.length > 0 && messages[messages.length - 1].isLoading) {
        alert('Previous response is still loading. Please wait.');
        setIsLoading(false);
        return;
      }
  
      const formData = new FormData();
      formData.append('text', question);
  
      const newMessage = { text: question, response: 'Loading...', isAnswer: true, isLoading: true, showFullResponse: false };
  
      if (currentSession) {
        const sessionID = currentSession.id;
        const updatedMessages = [...loadMessages(sessionID), newMessage];
        saveMessages(sessionID, updatedMessages);
        setCurrentSession({ ...currentSession, messages: updatedMessages });
        updateWorkInSession(1);
      }
  
      const apiResponse = await fetch('http://20.121.131.26:8000/proto/', {
        method: 'POST',
        body: formData,
      });
  
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        const updatedMessages = loadMessages(currentSession.id).map((message) =>
          message.text === question
            ? { ...message, response: data.response, isLoading: false }
            : message
        );
  
        saveMessages(currentSession.id, updatedMessages);
        setCurrentSession({ ...currentSession, messages: updatedMessages });
        updateWorkInSession(1);
  
        setTimeout(() => {
          const updatedMessagesAfterDelay = updatedMessages.map((message) =>
            message.text === question ? { ...message, showFullResponse: true } : message
          );
  
          saveMessages(currentSession.id, updatedMessagesAfterDelay);
          setCurrentSession({ ...currentSession, messages: updatedMessagesAfterDelay });
        }, 3000);
  
        setFrequentlyAskedQuestions((prevQuestions) => [question, ...prevQuestions]);
      } else {
        console.error('Server error: Unexpected status code ' + apiResponse.status);
        setError('Server error: Unexpected status code ' + apiResponse.status);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const handleUserSettingsClick = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSaveDialog = () => {
    closeDialog();
  };
  const renderResponse = (response, showFullResponse) => {
    const headingRegex = /^(Citations|LLM Output.*?|.*?):/;
    const lines = response.split('\n');
  
    let displayLines = lines;
    const llmOutputIndex = lines.findIndex((line) => line.includes('LLM Output'));
  
    if (llmOutputIndex !== -1 && !showFullResponse) {
      displayLines = lines.slice(0, llmOutputIndex + 1);
    }
  
    return (
      <div className={`message answerrrrr`}>
        {displayLines.map((line, index) => {
          const matches = line.match(headingRegex);
          const isHeading = matches && matches.length > 1;
          const style = isHeading ? { fontWeight: 'bold' } : {};
  
          return (
            <div key={index}>
              <span style={style}>
                {matches ? matches[1] : ''}
              </span>
              {line.substring(matches ? matches[0].length : 0)}
            </div>
          );
        })}
      </div>
    );
  };
  const handleEditBlur = (e, index) => {
    const editedText = e.target.innerText;
    // console.log("Edit blur event for index:", index, "Edited text:", editedText);
  };
  
  
  
  
  return (
    <div className={`App ${isChatSidebarOpen ? 'chat-sidebar-open' : 'chat-sidebar-closed'} ${isRightSidebarOpen ? 'right-sidebar-open' : 'right-sidebar-closed'}`}>
      {isConfirmationDialogOpen && <div className="blur-background"></div>}

    <div className='header'>
    <img className='logo' src={micro} alt="Azurecxp Logo" />
        <span style={{ marginLeft: 'auto', marginRight: 'auto' }}>AZURE</span>
    </div>
    <div className='content'>
        {isChatSidebarOpen && (
    <div className="chat-sidebar">
      <div className='upperside'>
      <div className="sidebar-header">History</div>
      <button className="new-chat-button" onClick={createSession}>
        + New Chat
      </button>
      <div className="chat-list">
        
      <ul>
        {sessions.map((session) => (
          <li
            key={session.id}
            className={currentSession && currentSession.id === session.id ? 'active' : ''}
          >
            {editSessionId === session.id ? (
              <input
                type="text"
                value={session.name || `Session ${session.id}`}
                onChange={(e) => {
                  const newName = e.target.value;
                  const updatedSessions = sessions.map((s) =>
                    s.id === session.id ? { ...s, name: newName } : s
                  );
                  setSessions(updatedSessions);
                }}
                onBlur={() => toggleEditSession(session.id)}
                onKeyDown={(e) => handleKeyDown(e, session.id)}
                style={{ width: '80%', maxWidth: '200px' }} 
              />
            ) : (
              <span
                onClick={() => handleSessionClick(session)}
              >
                <img src={chatSvg} alt="chat" className="chat-icon" />
                {session.name || `Session ${session.id}`}
              </span>
            )}
            <button onClick={() => toggleEditSession(session.id)} className="rename-button">
              <img src={renamesvg} alt="rename" />
            </button>
            <button onClick={() => deleteSession(session.id)} className="delete-button">
              <img src={deleteSvg} alt="delete" />
            </button>
          </li>
        ))}
      </ul>
      </div>
      </div>
      <div className='lowerside'>
        <div className='chathistory' onClick={openConfirmationDialog}>Delete history<img className='delimg' src={del2png} alt="delete" /></div>
        <div className='chathistory1' onClick={handleUserSettingsClick}>User Settings</div>
      {isDialogOpen && (
        <div className="dialog-box">
          <h2 style={{color:'white'}}>Instructions</h2>
          <input
          style={{width:'80%',marginBottom:'5px'}}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ex-Data Engineer"
          />
          <button className='button2' onClick={handleSaveDialog}>Save</button>
        </div>
      )}
    
       
  <div className='bottom2'>

  <img className='ecimg' src={vectorpng} alt='vector' />
  <div className='bottomtext'>AZURECXP</div></div>

      </div>
    </div>
    )}
    <div className='toggle-sidebar-container'>
          <button className='toggle-sidebar-button' onClick={toggleChatSidebar}>
            {isChatSidebarOpen ? '<' : '>'}
          </button>
        </div>
    <div className='main'>

          <div className="chat-body">
          <ConfirmationDialog
          isOpen={isConfirmationDialogOpen}
          onClose={closeConfirmationDialog}
          onConfirm={handleConfirmDeleteAllSessions}
        />
          {/* <button className='savebutton'>SaveSession</button> */}
          {/* <div className="samplepage">
          {!messages.length && showSampleCards && (
              <>
                <SampleCard content="Get key info" />
                <SampleCard content="Perform analysis" />
                <SampleCard content="Analyse on a specific file" />
                <SampleCard content="Perform Statistics" />
              </>
            )}
            </div> */}
            {messages.map((message, index) => (
          <div className="message" key={index}>
            <div className={`message ${message.isAnswer ? 'questionss' : ''}`}>
              <div className="message1">
                <img className='ecimg1' src={vectorpng1} alt='vector' />
                <div className={`message question`}>
                  {isEditMode && index === editedMessageIndex ? (
                    <>
                      <div
  style={{
    width: '70%',
    // border: '1px solid #ccc',
    padding: '5px',
    maxHeight: '100px', 
    overflowY: 'auto', 
  }}
  value={editedQuestion} 
  onChange={(e) => setEditedQuestion(e.target.value)}
  contentEditable={isEditMode && index === editedMessageIndex}
  onBlur={(e) => handleEditBlur(e, index)}
  dangerouslySetInnerHTML={{
    __html: isEditMode && index === editedMessageIndex ? editedQuestion : message.text,
  }}
/>
                      <div className='edit-buttons'>
                        <button className='button3' style={{marginRight:'5px'}} onClick={handleEditSubmit}>Submit</button>
                        <button className='button3' onClick={handleCancelEdit}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      {message.text}
                      <div className='edit1' onClick={() => toggleEditQuestion(index, message.text)}>
                        <img src={edit1} alt='edit1' />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

    {message.isAnswer && (
              <div className="message1">
                <img className='ecimg2' src={vector1} alt='vector1' />
                {message.isLoading ? (
                  <div className={`message answerrrrr`}>
                    <div>Verifying Database</div>
                    <ThreeDots
                      visible={true}
                      width="80"
                      color="blue"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </div>
                ) : (
                  renderResponse(message.response, message.showFullResponse)
                )}
              </div>
            )}
  </div>
))}

            {error && (
              <div className="message error">
                <p>{error}</p>
              </div>
            )}

{currentSession && messages.length > 0 && (
        <div className='regenerate' onClick={handleRegenerateClick}>
          <img className='regeneratebutton' src={regeneratepng} alt='regenerate' />Regenerate
        </div>
      )}
          </div>
          <div className='chatfooter'>
            <form className='inp' onSubmit={handleSubmit}>
              <input
                type="text"
                value={text}
                onChange={handleInputChange}
                placeholder="Type your message..."
                required
              />
              <label htmlFor="fileInput" className="file-upload">
                <img src={fileup} alt="file upload" />
                <input type="file" id="fileInput" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
              <button className='send'>
                <img className='sendimg' src={sendBtn} alt="send"></img>
              </button>
              {/* {isLoading && <span>Loading...</span>} */}
            </form>
          </div>
        </div>
        <div className='toggle-sidebar-container'>
          <button className='toggle-sidebar-button1' onClick={toggleRightSidebar}>
            {isRightSidebarOpen ? '>' : '<'}
          </button>
        </div>
        
      
        {isRightSidebarOpen && (
        <RightSidebar
          frequentlyAskedQuestions={initialQuestions}
          handleQuestionClick={handleQuestionClick}
          
        />)}
    </div>
    </div>
  );
};

export default App;
