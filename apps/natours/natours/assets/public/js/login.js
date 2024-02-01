const LOGIN_FORM = document.querySelector('.form');
// const LOGIN_FORM = document.getElementById('login-form')

// console.log(LOGIN_FORM, typeof LOGIN_FORM)

// Login function
const login = async (email, password) => {
  try {
    const res = await fetch('/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    console.log('finally');
  }
};

LOGIN_FORM.addEventListener('submit', async (e) => {
  try {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await login(email, password);
    //   const res = await fetch('/api/v1/users/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       email,
    //       password
    //     })
    //   })

    //   const data = await res.json()

    //   console.log(data)
  } catch (error) {
    console.error(error, 'manual error');
    // throw new Error(error)
  } finally {
    console.log('finally 2');
    e.target.reset();
  }
});
