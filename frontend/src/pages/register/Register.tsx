import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, reset } from "../../features/auth/authSlice";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion, type Variants } from "framer-motion";
import { toast } from "react-toastify";
import "./register.scss";
import Spinner from "../../components/common/spinner/Spinner";
import PasswordStrengthIndicator from "../../components/common/PasswordStrengthIndicator/PasswordStrengthIndicator";
import { validatePassword } from "../../utils/passwordValidation";
import SalyImage from "../../assets/backdrops/Saly-7.png";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const imageVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Register() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = formData;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, isLoading, isSuccess, message } = useAppSelector(
    (state) => state.auth
  );

  const isOnline = useAppSelector((state) => state.network.isOnline);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(() =>
    validatePassword("")
  );

  useEffect(() => {
    if (isSuccess || user) {
      navigate("/");
    }

    dispatch(reset());
  }, [user, isSuccess, message, navigate, dispatch]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength(validatePassword(value));
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!passwordStrength.isValid) {
      toast.error(
        "Please ensure your password meets all security requirements"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (name.trim().length < 2) {
      toast.error("Please enter a valid name (at least 2 characters)");
      return;
    }

    const userData = {
      name: name.trim(),
      email: email.trim(),
      password,
    };

    dispatch(register(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <motion.div
      className="register-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="register-illustration" variants={itemVariants}>
        <motion.div
          className="floating-blob blob-1"
          initial={{ opacity: 0.7 }}
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
            transition: {
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
        <motion.div
          className="floating-blob blob-2"
          initial={{ opacity: 0.5 }}
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
            transition: {
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            },
          }}
        />
        <motion.div
          className="image-container"
          variants={imageVariants}
          initial="initial"
          animate="animate"
        >
          <img
            src={SalyImage}
            alt="Register Illustration"
            className="saly-image"
          />
        </motion.div>
      </motion.div>

      <motion.div className="register-card" variants={itemVariants}>
        <motion.div className="register-header" variants={itemVariants}>
          <h1>Create Account</h1>
          <p className="subtitle">Join us and start tracking your expenses</p>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          className="register-form"
          variants={itemVariants}
        >
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                placeholder="Enter your full name"
                onChange={onChange}
                disabled={!isOnline}
                required
                className={name ? "has-value" : ""}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={onChange}
                disabled={!isOnline}
                required
                className={email ? "has-value" : ""}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                placeholder="Enter your password"
                onChange={onChange}
                disabled={!isOnline}
                required
                className={password ? "has-value" : ""}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {password && (
              <PasswordStrengthIndicator
                strength={passwordStrength}
                showDetails={true}
              />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                placeholder="Confirm your password"
                onChange={onChange}
                disabled={!isOnline}
                required
                className={confirmPassword ? "has-value" : ""}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <div className="password-mismatch">Passwords do not match</div>
            )}
          </div>

          <button
            type="submit"
            className="btn-register"
            disabled={
              !isOnline ||
              !passwordStrength.isValid ||
              password !== confirmPassword
            }
          >
            Create Account
          </button>
        </motion.form>

        <motion.div className="login-link" variants={itemVariants}>
          Already have an account? <Link to="/login">Sign In</Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Register;
