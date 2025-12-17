import React from "react";
import {
  type PasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthText,
} from "../../../utils/passwordValidation";
import { FaCheck, FaTimes } from "react-icons/fa";
import "./PasswordStrengthIndicator.scss";

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
  showDetails?: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  strength,
  showDetails = true,
}) => {
  const { score, criteria, feedback } = strength;
  const color = getPasswordStrengthColor(score);
  const text = getPasswordStrengthText(score);

  return (
    <div className="password-strength-indicator">
      {/* Progress Bar */}
      <div className="strength-bar">
        <div className="strength-progress">
          <div
            className="strength-fill"
            style={{
              width: `${(score / 4) * 100}%`,
              backgroundColor: color,
            }}
          />
        </div>
        <span className="strength-text" style={{ color }}>
          {text}
        </span>
      </div>

      {/* Criteria Checklist */}
      {showDetails && (
        <div className="criteria-list">
          <div className={`criterion ${criteria.length ? "met" : "unmet"}`}>
            <span className="criterion-icon">
              {criteria.length ? <FaCheck /> : <FaTimes />}
            </span>
            <span className="criterion-text">At least 8 characters</span>
          </div>

          <div className={`criterion ${criteria.uppercase ? "met" : "unmet"}`}>
            <span className="criterion-icon">
              {criteria.uppercase ? <FaCheck /> : <FaTimes />}
            </span>
            <span className="criterion-text">One uppercase letter (A-Z)</span>
          </div>

          <div className={`criterion ${criteria.lowercase ? "met" : "unmet"}`}>
            <span className="criterion-icon">
              {criteria.lowercase ? <FaCheck /> : <FaTimes />}
            </span>
            <span className="criterion-text">One lowercase letter (a-z)</span>
          </div>

          <div className={`criterion ${criteria.numbers ? "met" : "unmet"}`}>
            <span className="criterion-icon">
              {criteria.numbers ? <FaCheck /> : <FaTimes />}
            </span>
            <span className="criterion-text">One number (0-9)</span>
          </div>

          <div className={`criterion ${criteria.symbols ? "met" : "unmet"}`}>
            <span className="criterion-icon">
              {criteria.symbols ? <FaCheck /> : <FaTimes />}
            </span>
            <span className="criterion-text">
              One special character (!@#$%^&*)
            </span>
          </div>
        </div>
      )}

      {/* Feedback Messages */}
      {showDetails && feedback.length > 0 && (
        <div className="feedback-messages">
          {feedback.map((message, index) => (
            <div key={index} className="feedback-message">
              {message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
