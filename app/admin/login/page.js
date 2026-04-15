'use client';

import { login } from '@/app/actions/auth';
import { useActionState } from 'react';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className={styles.title}>ZAM Edutoys</h1>
          <p className={styles.subtitle}>Admin Dashboard</p>
        </div>

        <form action={action} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@zamedutoys.com"
                className={styles.input}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 11V7C7 5.67 7.53 4.4 8.46 3.46C9.4 2.53 10.67 2 12 2C13.33 2 14.6 2.53 15.54 3.46C16.47 4.4 17 5.67 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className={styles.input}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {state?.error && (
            <div className={styles.errorAlert}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {state.error}
            </div>
          )}

          <button
            id="login-submit-btn"
            type="submit"
            className={styles.submitBtn}
            disabled={pending}
          >
            {pending ? (
              <span className={styles.loadingSpinner} />
            ) : (
              <>
                <span>Masuk</span>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <p className={styles.footer}>
          ZAM Edutoys Admin · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
