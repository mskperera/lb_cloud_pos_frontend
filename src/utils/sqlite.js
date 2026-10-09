 import Database from '@tauri-apps/plugin-sql';
 
 
  export const ensureCredentialsTable = async () => {
 
    try {
           const db = await Database.load('sqlite:credentials.db');

    console.log('Ensuring credentials table exists in SQLite database...');
      await db.execute(`
        CREATE TABLE IF NOT EXISTS credentials (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT,
          password TEXT,
          isLogOut INTEGER DEFAULT 0
        )
      `);

    } catch (error) {
      console.error('Failed to ensure credentials table exists:', error);
    }
  };

 export const getSavedCredentials = async () => {
  try {

  const db = await Database.load('sqlite:credentials.db');
    const result = await db.select('select email, password from credentials limit 1');

    const rows = Array.isArray(result) ? result : [];
    const credential = rows.length ? rows[0] : null;
    return credential;

  } catch (error) {
    console.error('Failed to load saved credentials:', error);
  }
};

 export const removeIsLogOut = async () => {
  
  
  
      try {
            const db = await Database.load('sqlite:credentials.db');

        await db.execute('UPDATE credentials SET isLogOut = 0');
          console.log('Logout flag cleared in SQLite database.');
    } catch (error) {
      console.error('Failed to clear logout flag:', error);
    }
  };

  export const getIsLogOut = async () => {
  
     
 
      try {
             const db = await Database.load('sqlite:credentials.db');

        const result = await db.select('SELECT isLogOut FROM credentials ORDER BY id DESC LIMIT 1');
        if (!Array.isArray(result) || !result.length) return false;

        return Number(result[0].isLogOut ?? 0) === 1;
       
    } catch (error) {
      console.error('Failed to read logout flag:', error);
      return false;
    }
  };



 export const setIsLogOut = async () => {
  try {
    const db = await Database.load('sqlite:credentials.db');
    await db.execute('UPDATE credentials SET isLogOut = 1');
  } catch (error) {
    console.error('Failed to set logout flag:', error);
  }
};

