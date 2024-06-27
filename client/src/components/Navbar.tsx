// src/components/Navbar.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';

const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className='flex justify-between px-8 py-6 shadow-xl items-center bg-slate-300'>
      <div className='text-4xl font-serif font-extrabold'>
        <Link to="/">CarWash Co</Link>
      </div>

      <div className=''>
        <ul className='flex gap-x-6 items-center font-mono'>
          
          <li>
            <Link className='hover:text-blue-700' to="/contactus">Contact Us</Link>
          </li>
          {!user ? (
            <>
              <li>
                <Link className='hover:text-blue-600' to="/signin">SignIn</Link>
              </li>
              <li>
                <Link className='hover:text-blue-600' to="/signup">SignUp</Link>
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleSignOut}>Sign Out</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
