import React from 'react';

const RightSidebar = ({ frequentlyAskedQuestions, handleQuestionClick }) => {
  return (
    <div className="right-sidebar">
      <div className="recent-questions">
        <h3 style={{ textAlign: 'center', color: '#1410f1', fontWeight: '800' }}>FAQ'S</h3>
        <ul>
          {frequentlyAskedQuestions.map((question, index) => (
            <li key={index} onClick={() => handleQuestionClick(question)}>
              <p>{question}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RightSidebar;
