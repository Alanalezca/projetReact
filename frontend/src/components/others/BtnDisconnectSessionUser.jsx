import React from 'react';
//import { Meteor } from 'meteor/meteor';
//import { useNavigate } from 'react-router-dom';

const BtnDisconnectSessionUser = () => {
  //const currentUser = Meteor.user();
  //const history = useHistory();

  const logoutUser = () => {
    //Meteor.logout(() => {
    //  history.go(0); // Rafraîchir proprement sans rechargement complet
    //});
  };

  return (
    <>
        {currentUser ? (
          <div>
            <p>Bienvenue, {currentUser.emails[0].address}</p>
            <button onClick={logoutUser}>Logout</button>
          </div>
        ) : (
          <>
          <p>Not Connected</p>
          </>
        )}
    </>
  );
};

export default BtnDisconnectSessionUser;