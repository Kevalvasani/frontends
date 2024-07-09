import './style.css';

const app = document.querySelector('#app');

const loadForm = (type) => {
  const formHtml = type === 'login' ? `
    <section class="vh-100">
      <div class="container d-flex align-items-center justify-content-center vh-60 bg-light">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-lg-12 col-xl-11">
            <div class="card text-black" style="border-radius: 22px;">
              <div class="card-body p-md-5">
                <div class="row justify-content-center">
                  <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign in</p>
                    <form id="login-form" class="mx-1 mx-md-4">
                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <input type="text" id="login-username" class="form-control" placeholder="Username"/>
                        </div>
                      </div>      
                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <input type="password" id="login-password" class="form-control" placeholder="Password"/>
                        </div>
                      </div>
                      <div class="form-check d-flex justify-content-center mb-5">
                        <input class="form-check-input me-2" type="checkbox" value="" id="form2Example3c" />
                        <label class="form-check-label" for="form2Example3">
                          I agree all statements in <a href="#!">Terms of service</a>
                        </label>
                      </div>
                      <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button type="submit" class="btn btn-primary btn-lg">Submit</button>
                      </div>
                    </form>
                    <p class="text-center">Don't have an account? <a href="#" id="signup-link">Sign up</a></p>
                  </div>
                  <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp" class="img-fluid" alt="Sample image">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  ` : `
    <section class="vh-100">
      <div class="container d-flex align-items-center justify-content-center vh-60 bg-light">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-lg-12 col-xl-11">
            <div class="card text-black" style="border-radius: 22px;">
              <div class="card-body p-md-5">
                <div class="row justify-content-center">
                  <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>
                    <form id="register-form" class="mx-1 mx-md-4">
                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <input type="text" id="reg-first-name" class="form-control" placeholder="First Name"/>
                        </div>
                      </div>
                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <input type="text" id="reg-last-name" class="form-control" placeholder="Last Name"/>
                        </div>
                      </div>
                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-envelope fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <input type="email" id="reg-email" class="form-control" placeholder="Email"/>
                        </div>
                      </div>
                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <input type="text" id="reg-username" class="form-control" placeholder="Username"/>
                        </div>
                      </div>
                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <input type="password" id="reg-password" class="form-control" placeholder="Password"/>
                        </div>
                      </div>
                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <input type="password" id="reg-password2" class="form-control" placeholder="Repeat Password"/>
                        </div>
                      </div>
                      <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button type="submit" class="btn btn-primary btn-lg">Register</button>
                      </div>
                    </form>
                    <p class="text-center">Don't have an account? <a href="#" id="signin-link">Sign In</a></p>
                  </div>
                  <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp" class="img-fluid" alt="Sample image">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  app.innerHTML = formHtml;

  if (type === 'login') {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-link').addEventListener('click', (event) => {
      event.preventDefault();
      loadForm('signup');
    });
  } else {
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('signin-link').addEventListener('click', (event) => {
      event.preventDefault();
      loadForm('login');
    });
  }
};

const handleLogin = (event) => {
  event.preventDefault();

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  fetch('http://127.0.0.1:8000/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.access) {
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      alert('Login successful!');
      window.location.replace("/templates/dashboard.html");
    } else {
      alert('Login failed!');
    }
  })
  .catch(error => console.error('Error:', error));
};

const handleRegister = (event) => {
  event.preventDefault();

  const first_name = document.getElementById('reg-first-name').value;
  const last_name = document.getElementById('reg-last-name').value;
  const email = document.getElementById('reg-email').value;
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;
  const password2 = document.getElementById('reg-password2').value;

  fetch('http://127.0.0.1:8000/register/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ first_name, last_name, email, username, password, password2 }),
  })
  .then(response => {
    console.log(response)
    if (response.status === 201) {
      alert('Register successful!');
      loadForm('login');
    } else {
      return response.json().then(data => {
        alert('Register failed: ' + data.message);
      });
    }
  })
  .catch(error => console.error('Error:', error));
};

loadForm('login');