import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, reset } from "../../features/auth/authSlice";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion, type Variants } from "framer-motion";
import "./login.scss";
import SalyImage from "../../assets/backdrops/Saly-12.png";
import SplashScreen from "../../components/SplashScreen";
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
  email: string;
  password: string;
}

function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, isLoading, isSuccess } = useAppSelector((state) => state.auth);

  const isOnline = useAppSelector((state) => state.network.isOnline);

  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);

  useEffect(() => {
    if (isSuccess && loginAttempted && user) {
      navigate("/");
    }
    if (loginAttempted) {
      dispatch(reset());
    }
  }, [isSuccess, loginAttempted, navigate, dispatch, user]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setLoginAttempted(true);
    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
  };

  if (isLoading) {
    return <SplashScreen message="Signing in..." isLoading={true} />;
  }

  return (
    <motion.div
      className="login-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="login-illustration" variants={itemVariants}>
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
            alt="Login Illustration"
            className="saly-image"
          />
        </motion.div>
      </motion.div>

      <motion.div className="login-card" variants={itemVariants}>
        <motion.div className="login-header" variants={itemVariants}>
          <h1>Welcome Back</h1>
          <p className="subtitle">Sign in to your account</p>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          className="login-form"
          variants={itemVariants}
        >
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
          </div>

          <button type="submit" className="btn-login" disabled={!isOnline}>
            Continue
          </button>
        </motion.form>

        <motion.div className="register-link" variants={itemVariants}>
          Don&apos;t have an account?{" "}
          <Link to="/register">Create an account</Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Login;
