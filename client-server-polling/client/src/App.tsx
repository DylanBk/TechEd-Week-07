import { useEffect, useState } from 'react';

const App = () => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    username: ''
  });

  useEffect(() => {
    if (!formData.username) {
      setIsValid(null);

      return;
    };

    const handler = setTimeout(() => {
      const userCheck = async () => {
        try {
          console.log(`checking db for username: ${formData.username}`);
          const req = await fetch('/api/usernamecheck', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: formData.username })
          });
          const res = await req.json();
          if (res.ok) {
            setIsValid(true);
          } else {
            setIsValid(false);
          };
        } catch (e) {
          console.error('Error in useEffect:', e);
          setIsValid(false);
        };
      };
      userCheck();
    }, 300);

    return () => clearTimeout(handler);
  }, [formData.username]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <form className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center p-4 rounded-xl bg-black/20" onSubmit={() => null}>
        <h1 className='text-3xl font-[600]'>Create Account</h1>

        <div className="flex flex-col">
          <label htmlFor="username">Create username:</label>

          <input
            name='username'
            type="text"
            placeholder='Your username...'
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email">Enter email:</label>

          <input
            name='email'
            type="email"
            placeholder='Your email...'
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password">Create password:</label>

          <input
            name='password'
            type="password"
            placeholder='Your password...'
            required
          />
        </div>

        {isValid && formData.username !== '' ? (
          <div className='p-2 rounded-md bg-green-500/10 text-green-500'>
            <p>This username is available.</p>
          </div>
        ) : isValid === false && (
          <div className='p-2 rounded-md bg-red-500/10 text-red-500'>
            <p>This username already exists.</p>
          </div>
        )}

        {/* disabled button if !isValid */}
        <button
          type='submit'
          className={`p-2 rounded-md bg-blue-500 text-white ${!isValid ? 'opacity-50 !cursor-not-allowed' : ''}`}
          disabled={!isValid}>
          Create
        </button>
      </form>
    </>
  );
}
;
export default App
