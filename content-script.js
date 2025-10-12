import { Converter } from "easy-currencies";
import {createClient} from "@supabase/supabase-js";

const supabase = createClient(
    chrome.runtime.getManifest().env.supabaseURL,
    chrome.runtime.getManifest().env.supabaseKEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: {
          getItem: (key) => Promise.resolve(localStorage.getItem(key)),
          setItem: (key, value) => {
            localStorage.setItem(key, value);
            return Promise.resolve();
          },
          removeItem: (key) => {
            localStorage.removeItem(key);
            return Promise.resolve();
          },
        },
      },
    }
);

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const userAccountFunctions = {
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  currentUser() {
    return supabase.auth.getUser();
  },

  async saveCard(card) {
    const user = await this.currentUser();
    if (!user.data.user) throw new Error('Not logged in');

    const { data, error } = await supabase
        .from('user_cards')
        .insert([{
          user_id: user.data.user.id,
          card_name: card.name,
          card_variant: card.variant || '',
          notes: card.notes || ''
        }]);
    if (error) throw error;
    return data;
  },

  async getCards() {
    const user = await this.currentUser();
    if (!user.data.user) throw new Error('Not logged in');

    const { data, error } = await supabase
        .from('user_cards')
        .select('*')
        .eq('user_id', user.data.user.id);

    if (error) throw error;
    return data;
  },

  async deleteCard(cardId) {
    const user = await this.currentUser();
    if (!user.data.user) throw new Error('Not logged in');

    const { data, error } = await supabase
        .from('user_cards')
        .delete()
        .eq('id', cardId)
        .eq('user_id', user.data.user.id); // only their own data

    if (error) throw error;
    return data;
  }
};

async function manageUserData() {
  const currentUser = (await userAccountFunctions.currentUser()).data?.user?.email || "Not Logged In";
  if (currentUser !== "Not Logged In") { // logged in
    const navbarAccountContainer = document.querySelector("#navbar-content #navbar-buttons");

    const accountButton = document.createElement("button");
    accountButton.type = "button";
    accountButton.title = "My account";
    accountButton.setAttribute("aria-label", "My account");
    accountButton.className = "navbar-button dropdown-toggle";
    accountButton.setAttribute("data-toggle", "dropdown");
    accountButton.setAttribute("data-target", "#navbar-account-dropdown-tcgplusplus");

    const avatarSpan = document.createElement("span");
    avatarSpan.id = "navbar-button-user-avatar";
    avatarSpan.setAttribute("aria-hidden", "true");
    avatarSpan.textContent = "++";

    const caretSpan = document.createElement("span");
    caretSpan.className = "dropdown-toggle-caret";
    caretSpan.setAttribute("aria-hidden", "true");

    const accountDropdown = document.createElement("div");

    accountDropdown.innerHTML = `
  <div id="navbar-account-dropdown-tcgplusplus" class="dropdown" data-toggle-text-separator=", " data-menu-alignment="end">
    <div class="dropdown-menu" style="">
      <div class="dropdown-menu-content">
        <div class="dropdown-text">
          TCG++ : <strong>${currentUser}</strong>
        </div>

        <div class="dropdown-divider"></div>

        <a href="/account/settings" class="dropdown-option">
          <span class="dropdown-option-left-item-container">
            <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-gear fa-fw"></span>
          </span>
          Settings
        </a>

        <a href="/export-data" class="dropdown-option">
          <span class="dropdown-option-left-item-container">
            <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-file-arrow-down fa-fw"></span>
          </span>
          Export my data
        </a>

        <div class="dropdown-divider"></div>

        <a href="/plusplusaccount/sign-out" class="dropdown-option">
          <span class="dropdown-option-left-item-container">
            <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-right-from-bracket fa-fw"></span>
          </span>
          Sign Out
        </a>
      </div>
    </div>
  </div>
`;

    accountButton.appendChild(avatarSpan);
    accountButton.appendChild(caretSpan);
    navbarAccountContainer.appendChild(accountButton);
    navbarAccountContainer.appendChild(accountDropdown);
  } else if (currentUser === "Not Logged In") { // not logged in
    const navbarAccountContainer = document.querySelector("#navbar-content #navbar-buttons");

    const accountButton = document.createElement("button");
    accountButton.type = "button";
    accountButton.title = "My account";
    accountButton.setAttribute("aria-label", "My account");
    accountButton.className = "navbar-button dropdown-toggle";
    accountButton.setAttribute("data-toggle", "dropdown");
    accountButton.setAttribute("data-target", "#navbar-account-dropdown-tcgplusplus");

    const avatarSpan = document.createElement("span");
    avatarSpan.id = "navbar-button-user-avatar";
    avatarSpan.setAttribute("aria-hidden", "true");
    avatarSpan.textContent = "++";

    const caretSpan = document.createElement("span");
    caretSpan.className = "dropdown-toggle-caret";
    caretSpan.setAttribute("aria-hidden", "true");

    const accountDropdown = document.createElement("div");

    accountDropdown.innerHTML = `
  <div id="navbar-account-dropdown-tcgplusplus" class="dropdown" data-toggle-text-separator=", " data-menu-alignment="end">
    <div class="dropdown-menu" style="">
      <div class="dropdown-menu-content">
        <div class="dropdown-text">
          TCG++ : <strong>${currentUser}</strong>
        </div>

        <div class="dropdown-divider"></div>

        <a href="/account/settings" class="dropdown-option">
          <span class="dropdown-option-left-item-container">
            <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-gear fa-fw"></span>
          </span>
          Settings
        </a>

        <a href="/export-data" class="dropdown-option">
          <span class="dropdown-option-left-item-container">
            <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-file-arrow-down fa-fw"></span>
          </span>
          Export my data
        </a>

        <div class="dropdown-divider"></div>

        <a href="/plusplusaccount/sign-in" class="dropdown-option">
          <span class="dropdown-option-left-item-container">
            <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-right-from-bracket fa-fw"></span>
          </span>
          Sign In
        </a>
      </div>
    </div>
  </div>
`;

    accountButton.appendChild(avatarSpan);
    accountButton.appendChild(caretSpan);
    navbarAccountContainer.appendChild(accountButton);
    navbarAccountContainer.appendChild(accountDropdown);
  }

  if (window.location.pathname === "/plusplusaccount/sign-in") {
    const notFoundContainer = document.querySelector("#page-header");
    if (notFoundContainer) notFoundContainer.remove();

    const notFoundContainer2 = document.querySelector("#page-content .container");
    if (notFoundContainer2) notFoundContainer2.remove();

    const pageContentContainer = document.querySelector("#page-content");
    if (pageContentContainer && currentUser === "Not Logged In") { // not logged in
      const authElement = document.createElement("div");
      authElement.className = "auth-box";
      authElement.innerHTML = `
  <div class="auth-toggle">
    <button id="signInBtn" class="active">Sign In</button>
    <button id="signUpBtn">Sign Up</button>
  </div>

  <form id="signInForm" class="auth-form active">
    <h2>Welcome Back!</h2>
    <input type="email" id="signin-email" placeholder="Email" required />
    <input type="password" id="signin-password" placeholder="Password" required />
    <button type="submit">Sign In</button>
    <p class="note">Forgot password? <a href="#">Reset</a></p>
  </form>

  <form id="signUpForm" class="auth-form">
    <h2>Create Account</h2>
    <input type="email" id="signup-email" placeholder="Email" required />
    <input type="password" id="signup-password" placeholder="Password" required />
    <button type="submit">Sign Up</button>
    <p class="note">Already have an account? <a href="#" id="switchToSignIn">Sign In</a></p>
  </form>
`;

      pageContentContainer.appendChild(authElement);

      document.addEventListener("click", async (e) => {
        const signInBtn = document.getElementById('signInBtn');
        const signUpBtn = document.getElementById('signUpBtn');
        const signInForm = document.getElementById('signInForm');
        const signUpForm = document.getElementById('signUpForm');
        const switchToSignIn = document.getElementById('switchToSignIn');

        // basic sanity check to make sure these elements ARE here
        if (!signUpBtn || !signInBtn || !signUpForm || !signInForm) {
          console.error('Missing elements:', { signUpBtn, signInBtn, signUpForm, signInForm }, " ❌");
          return;
        }

        if (!signInBtn || !signUpBtn) return;

        if (e.target === signUpBtn) {
          signUpBtn.classList.add('active');
          signInBtn.classList.remove('active');
          signUpForm.classList.add('active');
          signInForm.classList.remove('active');
        }

        if (e.target === signInBtn || e.target === switchToSignIn) {
          signInBtn.classList.add('active');
          signUpBtn.classList.remove('active');
          signInForm.classList.add('active');
          signUpForm.classList.remove('active');
        }
      });

      const signInForm = document.getElementById('signInForm');
      if (signInForm) {
        signInForm.addEventListener("submit", async (e) => {
          e.preventDefault();

          const email = document.getElementById("signin-email")?.value;
          const password = document.getElementById("signin-password")?.value;

          if (!email || !password) {
            alert("Please enter an email and password."); // just in case some error happens and values are blank
            return;
          }

          try {
            const { data } = await userAccountFunctions.signIn(email, password);

            console.log("Successfully logged in! ", data, " ✅");

            const authBoxContainer = document.querySelector("#page-content .auth-box");
            if (authBoxContainer) {
              while (authBoxContainer.firstChild) {
                authBoxContainer.firstChild.remove();
              }
            }

            const signedInElement = document.createElement("div");
            signedInElement.textContent = "Signed In Successfully!";

            authBoxContainer.appendChild(signedInElement);

            await wait(2500)

            window.location.reload();
          } catch (err) {
            alert("Sign-in failed: " + err.message);
          }
        });
      }

      const signUpForm = document.getElementById('signUpForm');
      if (signUpForm) {
        signUpForm.addEventListener("submit", async (e) => {
          e.preventDefault();

          const email = document.getElementById("signup-email")?.value;
          const password = document.getElementById("signup-password")?.value;

          if (!email || !password) {
            alert("Please enter an email and password."); // just in case some error happens and values are blank
            return;
          }

          try {
            const { data } = await userAccountFunctions.signUp(email, password);

            console.log("Successfully signed up! ", data, " ✅");

            const authBoxContainer = document.querySelector("#page-content .auth-box");
            if (authBoxContainer) {
              while (authBoxContainer.firstChild) {
                authBoxContainer.firstChild.remove();
              }
            }

            const signedUpElement = document.createElement("div");
            signedUpElement.textContent = "Signed Up Successfully! Make sure to check your email to confirm your sign-up.";

            authBoxContainer.appendChild(signedUpElement);

            await wait(3000)

            window.location.reload();
          } catch (err) {
            alert("Sign-up failed: " + err.message);
          }
        });
      }

      const styles = document.createElement('style')
      styles.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
* {
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

#page-content {
  position: relative;
}

.auth-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 30px;
  width: 360px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  font-family: 'Poppins', sans-serif;
}

.auth-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.auth-toggle button {
  background: transparent;
  border: none;
  outline: none;
  color: #ddd;
  font-size: 16px;
  padding: 8px 20px;
  cursor: pointer;
  transition: 0.3s ease;
}

.auth-toggle button.active {
  color: #fff;
  border-bottom: 2px solid #fff;
}

.auth-form {
  display: none;
  flex-direction: column;
  gap: 14px;
  transition: opacity 0.4s ease;
}

.auth-form.active {
  display: flex;
}

.auth-form h2 {
  text-align: center;
  margin-bottom: 10px;
  color: #fff;
}

.auth-form input {
  padding: 12px;
  border: none;
  border-radius: 8px;
  outline: none;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 15px;
}

.auth-form input::placeholder {
  color: rgba(255,255,255,0.8);
}

.auth-form button {
  margin-top: 10px;
  padding: 12px;
  background: #ffffff;
  color: #3a6186;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.auth-form button:hover {
  background: #ddd;
}

.note {
  font-size: 13px;
  text-align: center;
  color: #eee;
}

.note a {
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}
.note a:hover {
  text-decoration: underline;
}
    `;

      document.head.appendChild(styles)
    } else if (pageContentContainer && currentUser !== "Not Logged In") { // logged in
      const authElement = document.createElement("div");
      authElement.className = "auth-box";
      authElement.innerHTML = `
  <div class="auth-message">
    Already Signed In.
  </div>
  `

      pageContentContainer.appendChild(authElement)

      const styles = document.createElement('style')
      styles.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
* {
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

#page-content {
  position: relative;
}

.auth-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 30px;
  width: 360px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  font-family: 'Poppins', sans-serif;
}
    `;

      document.head.appendChild(styles)
    }
  }

  if (window.location.pathname === "/plusplusaccount/sign-out") {
    const notFoundContainer = document.querySelector("#page-header");
    if (notFoundContainer) notFoundContainer.remove();

    const notFoundContainer2 = document.querySelector("#page-content .container");
    if (notFoundContainer2) notFoundContainer2.remove();

    const pageContentContainer = document.querySelector("#page-content");
    if (pageContentContainer && currentUser === "Not Logged In") { // not logged in
      const authElement = document.createElement("div");
      authElement.className = "auth-box";
      authElement.innerHTML = `
  <div class="auth-message">
    Not signed in, cannot sign out.
  </div>
`;

      pageContentContainer.appendChild(authElement);

      const styles = document.createElement('style')
      styles.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
* {
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

#page-content {
  position: relative;
}

.auth-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 30px;
  width: 360px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  font-family: 'Poppins', sans-serif;
}
    `;

      document.head.appendChild(styles)
    } else if (pageContentContainer && currentUser !== "Not Logged In") { // logged in
      await userAccountFunctions.signOut();

      const authElement = document.createElement("div");
      authElement.className = "auth-box";
      authElement.innerHTML = `
  <div class="auth-message">
    Signed Out Successfully!
  </div>
  `

      pageContentContainer.appendChild(authElement)

      const styles = document.createElement('style')
      styles.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
* {
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

#page-content {
  position: relative;
}

.auth-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 30px;
  width: 360px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  font-family: 'Poppins', sans-serif;
}
    `;

      document.head.appendChild(styles)

      await wait(2500)

      window.location.reload();
    }
  }
}

let schnInjected = false;
function injectSimplifiedChinese() {
  // don't run again if already ran on the page only if the page IS reset
  if (schnInjected) return;
  schnInjected = true;

  // if we are on /sets/schn, delete the "not found" and inject our new page
  if (window.location.pathname === "/sets/schn") {
    const notFoundContainer = document.querySelector("#page-header");
    if (notFoundContainer) notFoundContainer.remove();

    const notFoundContainer2 = document.querySelector("#page-content .container");
    if (notFoundContainer2) notFoundContainer2.remove();

    const pageContentContainer = document.querySelector("#page-content");

    const stylesheetSetPage = document.createElement("link");
    stylesheetSetPage.rel = "stylesheet";
    stylesheetSetPage.href = "https://static.tcgcollector.com/build/css/page.sets.sets.d26a8807.css";

    if (!document.querySelector(`link[href="${stylesheetSetPage.href}"]`)) { // avoid duplicates
      document.head.appendChild(stylesheetSetPage);
      console.log(`Set Page Stylesheet injected: ${stylesheetSetPage.href} ✅`);
    }

    if (pageContentContainer) {
      pageContentContainer.innerHTML = `
  <div class="container">

    <div id="tcg-region-links-button-group-container">

      <div id="tcg-region-links-button-group" class="button-group ">

        <a href="/sets/intl?setMode=allCardVariants&amp;releaseDateOrder=newToOld&amp;displayAs=logos" class="
        tcg-region-links-button-group-link
        button
        button-plain-alt
              " data-tcg-region-id="1" data-link-visitor-disabled="">
          International
        </a>
        <a href="/sets/jp?setMode=allCardVariants&amp;releaseDateOrder=newToOld&amp;displayAs=logos" class="
        tcg-region-links-button-group-link
        button
        button-plain-alt
              " data-tcg-region-id="2" data-link-visitor-disabled="">
          Japan
        </a></div>

      <div id="sets-page-buttons">

        <button type="button" title="Share my collection" aria-label="Share my collection" class="
              card-collection-share-button
              button
              button-plain-alt
              button-with-icon-only
            ">
          <span aria-hidden="true" class="button-icon fa-solid fa-share-nodes fa-fw"></span>
        </button>

        <button type="button" title="Change my preferences" aria-label="Change my preferences" id="sets-page-preferences-drawer-show-button" class="button button-plain-alt button-with-icon-only">
          <span aria-hidden="true" class="button-icon fa-solid fa-gear fa-fw"></span>
        </button>

      </div>

    </div>

    <div id="sets-page-actions">

      <div id="set-search-form-control-container" class="form-control-container">

        <span aria-hidden="true" class="form-control-icon fa-solid fa-magnifying-glass"></span>

        <button type="button" class="
            form-control-clear-button
                      " tabindex="-1">
        </button>

        <input type="search" id="set-search-form-control" name="setSearch" class="form-control" value="" placeholder="Search sets..." autocomplete="off" size="25">

      </div>

      <div id="set-source-radios-container">

        <div id="set-source-radios">

          <div class="radio set-source-radio">

            <input type="radio" id="radio-input-13582569" name="setSource" class="radio-input" value="all" checked="">

            <label for="radio-input-13582569" class="radio-label">
              <span aria-hidden="true" class="radio-indicator"></span>
              All
            </label>

          </div>

          <div class="radio set-source-radio">

            <input type="radio" id="radio-input-186843698" name="setSource" class="radio-input" value="cardCollectionInProgress">

            <label for="radio-input-186843698" class="radio-label">
              <span aria-hidden="true" class="radio-indicator"></span>
              In progress
            </label>

          </div>

          <div class="radio set-source-radio">

            <input type="radio" id="radio-input-555182996" name="setSource" class="radio-input" value="cardCollectionCompleted">

            <label for="radio-input-555182996" class="radio-label">
              <span aria-hidden="true" class="radio-indicator"></span>
              Completed
            </label>

          </div>
        </div>

        <div id="set-mode-dropdown-container">

          <label>Show sets as</label>

          <button type="button" class="
        dropdown-toggle
        button button-link-like-alt      " data-toggle="dropdown" data-target="#set-mode-dropdown">
            <span aria-hidden="true" class="dropdown-toggle-caret"></span>
            All card variants
          </button>

          <div id="set-mode-dropdown" class="
    dropdown
          dropdown-selectable
          " data-toggle-text-separator=", " data-query-string-key="setMode">

            <div class="dropdown-menu">

              <div class="dropdown-menu-content">

                <div class="dropdown-option " tabindex="0" data-value="anyCardVariant">
                  Any card variant
                </div>

                <div class="dropdown-option " tabindex="0" data-value="regularCardVariants">
                  Regular card variants
                </div>

                <div class="dropdown-option selected" tabindex="0" data-value="allCardVariants">
                  All card variants
                </div>

                <div class="dropdown-divider"></div>

                <div class="dropdown-option " tabindex="0" data-value="standardSet">
                  Standard set
                </div>

                <div class="dropdown-option " tabindex="0" data-value="parallelSet">
                  Parallel set
                </div>

                <div class="dropdown-divider"></div>

                <a href="/account/settings/card-collection" class="dropdown-option">
                    <span class="dropdown-option-left-item-container">
                        <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-gear fa-fw">
                        </span>
                    </span>
                  Change progress settings
                </a>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>


  <div id="set-search-result" class="set-sort-by-expansion-series" style="--set-logo-reference-aspect-ratio: 2.5;">
  
    <div class="container">

      <div id="set-search-result-header">
      
        <div id="set-search-result-title">
          <!-- Real set amounts found data will be here -->
        </div>

        <div id="set-search-result-compact-header-buttons">
        
          <button
            type="button"
            title="Show the display options"
            aria-label="Show the display options"
            class="set-search-result-compact-header-button"
            data-show="drawer"
            data-target="#set-display-options-drawer">
            <span aria-hidden="true" class="fa-solid fa-arrow-down-wide-short"></span>
          </button>
          
        </div>
        
      </div>

      <div id="set-display-options">

        <div class="set-display-option">
        
          <label>Sort by</label>
          <button
            type="button"
            class="dropdown-toggle button button-link-like-alt"
            data-toggle="dropdown"
            data-target="#dropdown">
            <span aria-hidden="true" class="dropdown-toggle-caret"></span>
            Series
          </button>

          <div
            id="dropdown"
            class="dropdown dropdown-selectable set-display-option-dropdown"
            data-toggle-text-separator=", "
            data-query-string-key="sortBy">

            <div class="dropdown-menu">
              <div class="dropdown-menu-content">
                <div class="dropdown-option selected" tabindex="0" data-value="expansionSeries">Series</div>
                <div class="dropdown-option" tabindex="0" data-value="releaseDate">Release date</div>
                <div class="dropdown-option" tabindex="0" data-value="cardCollectionProgress">Collection progress</div>
                <div class="dropdown-option" tabindex="0" data-value="marketPriceDesc">Market price (desc)</div>
                <div class="dropdown-option" tabindex="0" data-value="marketPriceAsc">Market price (asc)</div>
              </div>
            </div>
            
          </div>
          
        </div>

        <div class="set-display-option">
          <label>From</label>
          <button
            type="button"
            class="dropdown-toggle button button-link-like-alt"
            data-toggle="dropdown"
            data-target="#dropdown">
            <span aria-hidden="true" class="dropdown-toggle-caret"></span>
            New to old
          </button>

          <div
            id="dropdown"
            class="dropdown dropdown-selectable set-display-option-dropdown"
            data-toggle-text-separator=", "
            data-query-string-key="releaseDateOrder">

            <div class="dropdown-menu">
              <div class="dropdown-menu-content">
                <div class="dropdown-option selected" tabindex="0" data-value="newToOld">New to old</div>
                <div class="dropdown-option" tabindex="0" data-value="oldToNew">Old to new</div>
              </div>
            </div>
          </div>
        </div>

        <div class="set-display-option">
          <label>Show</label>
          <button
            type="button"
            class="dropdown-toggle button button-link-like-alt"
            data-toggle="dropdown"
            data-target="#dropdown">
            <span aria-hidden="true" class="dropdown-toggle-caret"></span>
            Logos
          </button>

          <div
            id="dropdown"
            class="dropdown dropdown-selectable set-display-option-dropdown"
            data-toggle-text-separator=", "
            data-query-string-key="displayAs">

            <div class="dropdown-menu">
              <div class="dropdown-menu-content">
                <div class="dropdown-option" tabindex="0" data-value="list">List</div>
                <div class="dropdown-option selected" tabindex="0" data-value="logos">Logos</div>
              </div>
            </div>
            
          </div>
          
        </div>

      </div>
      
    </div>

    <div id="expansion-series-nav">
    
      <div class="container">
      
        <div id="expansion-series-nav-content">

          <button
            type="button"
            title="Show all series"
            aria-label="Show all series"
            id="expansion-series-nav-drawer-show-button"
            data-show="drawer"
            data-target="#expansion-series-nav-drawer">
            <span aria-hidden="true" class="button-icon fa-solid fa-list-ul"></span>
          </button>

          <button
            type="button"
            title="Scroll left"
            aria-label="Scroll left"
            id="expansion-series-nav-scroll-left-button"
            class="hidden">
            <span aria-hidden="true" class="button-icon fa-solid fa-chevron-left"></span>
          </button>

          <div id="expansion-series-nav-jump-links">
            <!-- Where the real Era jump link data will go. -->
          </div>

          <button
            type="button"
            title="Scroll right"
            aria-label="Scroll right"
            id="expansion-series-nav-scroll-right-button"
            class="hidden">
            <span aria-hidden="true" class="button-icon fa-solid fa-chevron-right"></span>
          </button>

        </div>
        
      </div>
      
    </div>

    <div class="container">
    
      <div id="set-logo-grids">
        <!-- Where the real Era and Set data will go. -->
      </div>
      
    </div>
    
  </div>
      `;
    }
  }

  // Actual Set card loading
  if (window.location.pathname.match(/^\/sets\/(?!40000)[4-9]\d{4}(?:\/|$)/)) { // this regex pattern is for detecting if we are IN a set above 40,000 (schn sets and up) right now.
    const notFoundContainer = document.querySelector("#page-header");
    if (notFoundContainer) notFoundContainer.remove();

    const notFoundContainer2 = document.querySelector("#page-content .container");
    if (notFoundContainer2) notFoundContainer2.remove();

    const pageContentContainer = document.querySelector("#page-content");

    const stylesheets = [
      "https://static.tcgcollector.com/build/css/533.7c42d940.css",
      "https://static.tcgcollector.com/build/css/806.b23a03c7.css",
      "https://static.tcgcollector.com/build/css/334.8a778794.css",
      "https://static.tcgcollector.com/build/css/703.62fc3631.css",
      "https://static.tcgcollector.com/build/css/232.8e1f3183.css",
      "https://static.tcgcollector.com/build/css/184.d294109f.css",
      "https://static.tcgcollector.com/build/css/page.cards.cards.434ad79d.css",
    ];

    stylesheets.forEach(url => {
      const exists = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(link => link.href === url);

      if (!exists) {
        const stylesheetLink = document.createElement("link");
        stylesheetLink.rel = "stylesheet";
        stylesheetLink.href = url;
        document.head.appendChild(stylesheetLink);
        console.log(`Set Page Stylesheet injected: ${stylesheetLink.href} ✅`);
      } else {
        console.log(`Set Page Stylesheet already exists, skipping: ${url} ⚠️`);
      }
    });

    if (pageContentContainer) {
      pageContentContainer.innerHTML = `
      <div class="container">

    <div id="tcg-region-links-button-group-container">

<div id="tcg-region-links-button-group" class="button-group ">

      <a href="/cards" class="
        tcg-region-links-button-group-link
        button
        button-plain-alt
              " data-link-visitor-disabled="">
      All
    </a>
  
      <a href="/cards/intl" class="
        tcg-region-links-button-group-link
        button
        button-plain-alt
              " data-tcg-region-id="1" data-link-visitor-disabled="">
      International
    </a>
      <a href="/cards/jp" class="
        tcg-region-links-button-group-link
        button
        button-plain-alt
              " data-tcg-region-id="2" data-link-visitor-disabled="">
      Japan
    </a>
  
</div>

      <div id="cards-page-buttons">

                  <button type="button" title="Share my collection" aria-label="Share my collection" class="
              card-collection-share-button
              button
              button-plain-alt
              button-with-icon-only
            ">
            <span aria-hidden="true" class="button-icon fa-solid fa-share-nodes fa-fw"></span>
          </button>
        
        <button type="button" title="Change my preferences" aria-label="Change my preferences" class="button button-plain-alt button-with-icon-only" data-show="modal" data-target="#cards-page-preferences-modal">
          <span aria-hidden="true" class="button-icon fa-solid fa-gear fa-fw"></span>
        </button>

      </div>

    </div>

    <div id="cards-page-actions">

      <div id="card-search-form-control-container-container">

        <div id="card-search-form-control-container" class="form-control-container">

          <span aria-hidden="true" class="form-control-icon fa-solid fa-magnifying-glass"></span>

          <button type="button" class="
              form-control-clear-button
                          " tabindex="-1">
          </button>

          <input type="search" id="card-search-form-control" name="cardSearch" class="form-control" value="" placeholder="Search cards..." autocomplete="off" size="25">

        </div>

        <button type="button" id="card-filters-drawer-show-button" class="button button-plain-alt">

          <span aria-hidden="true" class="button-icon fa-solid fa-sliders"></span>

          Filter

          <span id="card-filters-drawer-show-button-active-count-container">
            (<span id="card-filters-drawer-show-button-active-count">0</span>)
          </span>

        </button>

      </div>

      <div id="card-source-radios">
                  
<div class="radio card-source-radio">

  <input type="radio" id="radio-input-973982780" name="cardSource" class="radio-input" value="all" checked="">

  <label for="radio-input-973982780" class="radio-label">
    <span aria-hidden="true" class="radio-indicator"></span>
    All
  </label>

</div>
                  
<div class="radio card-source-radio">

  <input type="radio" id="radio-input-1397881946" name="cardSource" class="radio-input" value="inCardCollection">

  <label for="radio-input-1397881946" class="radio-label">
    <span aria-hidden="true" class="radio-indicator"></span>
    In collection
  </label>

</div>
                  
<div class="radio card-source-radio">

  <input type="radio" id="radio-input-68147820" name="cardSource" class="radio-input" value="notInCardCollection">

  <label for="radio-input-68147820" class="radio-label">
    <span aria-hidden="true" class="radio-indicator"></span>
    Not in collection
  </label>

</div>
                  
<div class="radio card-source-radio">

  <input type="radio" id="radio-input-1123001963" name="cardSource" class="radio-input" value="inCardWishlist">

  <label for="radio-input-1123001963" class="radio-label">
    <span aria-hidden="true" class="radio-indicator"></span>
    In wishlist
  </label>

</div>
              </div>

    </div>

<div id="card-search-result" class="
        is-single-expansion-view-mode-active    set-like-view-mode-active        set-has-code    set-has-symbol    card-source-all
          card-image-dim-not-in-card-collection-enabled
      ">

  <div id="card-search-result-header">

    <div id="card-search-result-title">

        <!-- Real Set Name and Set Code image and name data will go here. -->

    </div>

<div id="card-search-result-header-actions-dropdown" class="
    dropdown
          " data-toggle-text-separator=", " data-menu-alignment="end">

    <button type="button" class="
        dropdown-toggle
        
          card-search-result-actions-dropdown-toggle
          button
          button-link-like
          button-right-aligned
              " data-toggle="dropdown" data-target="#card-search-result-header-actions-dropdown">
      <span aria-hidden="true" class="dropdown-toggle-caret"></span>
      Actions
    </button>

  <div class="dropdown-menu">

    <div class="dropdown-menu-content">
      
      <button type="button" class="card-search-result-action-button dropdown-option" data-action-type="AddAllToCardCollection">
      <div class="dropdown-option-left-item-container">
        <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-plus fa-fw">
        </span>
      </div>
      Add all to collection
    </button>
  
      <button type="button" class="card-search-result-action-button dropdown-option" data-action-type="RemoveAllFromCardCollection">
      <div class="dropdown-option-left-item-container">
        <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-eraser fa-fw icon-danger">
        </span>
      </div>
      Remove all from collection
    </button>
  
  <div class="dropdown-divider"></div>

      <button type="button" class="card-search-result-action-button dropdown-option" data-action-type="AddAllToCardWishlist">
      <div class="dropdown-option-left-item-container">
        <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-heart fa-fw">
        </span>
      </div>
      Add all to wishlist
    </button>
  
  <button type="button" class="card-search-result-action-button dropdown-option" data-action-type="RemoveAllFromCardWishlist">
    <div class="dropdown-option-left-item-container">
      <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-heart-crack fa-fw icon-danger">
      </span>
    </div>
    Remove all from wishlist
  </button>

                  </div>

  </div>

</div>
    
    <div id="card-search-result-compact-header-buttons">

        <button type="button" title="Show the display options" aria-label="Show the display options" class="card-search-result-compact-header-button" data-show="drawer" data-target="#card-display-options-drawer">
    <span aria-hidden="true" class="fa-solid fa-arrow-down-wide-short"></span>
  </button>

                <button type="button" title="Show all actions" aria-label="Show all actions" class="
                card-search-result-compact-header-button
                card-search-result-actions-dropdown-toggle
                dropdown-toggle
              " data-toggle="dropdown" data-target="#card-search-result-header-compact-actions-dropdown">
              <span aria-hidden="true" class="fa-solid fa-ellipsis-vertical"></span>
            </button>

<div id="card-search-result-header-compact-actions-dropdown" class="
    dropdown
          " data-toggle-text-separator=", " data-force-menu-to-toggle-min-offset="true" data-menu-alignment="end">

  <div class="dropdown-menu">

          <div class="dropdown-menu-arrow"></div>
    
    <div class="dropdown-menu-content">
      
      <button type="button" class="card-search-result-action-button dropdown-option" data-action-type="AddAllToCardCollection">
      <div class="dropdown-option-left-item-container">
        <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-plus fa-fw">
        </span>
      </div>
      Add all to collection
    </button>
  
      <button type="button" class="card-search-result-action-button dropdown-option" data-action-type="RemoveAllFromCardCollection">
      <div class="dropdown-option-left-item-container">
        <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-eraser fa-fw icon-danger">
        </span>
      </div>
      Remove all from collection
    </button>
  
  <div class="dropdown-divider"></div>

      <button type="button" class="card-search-result-action-button dropdown-option" data-action-type="AddAllToCardWishlist">
      <div class="dropdown-option-left-item-container">
        <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-heart fa-fw">
        </span>
      </div>
      Add all to wishlist
    </button>
  
  <button type="button" class="card-search-result-action-button dropdown-option" data-action-type="RemoveAllFromCardWishlist">
    <div class="dropdown-option-left-item-container">
      <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-heart-crack fa-fw icon-danger">
      </span>
    </div>
    Remove all from wishlist
  </button>
  
                    </div>

  </div>

</div>
      
    </div>

  </div>

  <div id="card-display-options-container">
    
<div id="card-search-result-set-like-card-collection-progress">

    <!-- Real Card Collection Progress data will go here. -->

</div>

<button type="button" class="
    set-like-card-collection-details-drawer-show-button
    button button-link-like-alt  " data-set-like-id="11423">
  
          <span aria-hidden="true" class="button-icon fa-solid fa-chart-simple"></span>
          View details
        
</button>

    <div class="card-display-option">

      <label>Sort by</label>

    <button type="button" class="
        dropdown-toggle
        button button-link-like-alt      " data-toggle="dropdown" data-target="#dropdown-1841156860">
      <span aria-hidden="true" class="dropdown-toggle-caret"></span>
      Card number
    </button>

<div id="dropdown-1841156860" class="
    dropdown
          dropdown-selectable
        card-display-option-dropdown  " data-toggle-text-separator=", " data-query-string-key="sortBy">

  <div class="dropdown-menu">

    <div class="dropdown-menu-content">
       
        <div class="dropdown-option selected" tabindex="0" data-value="cardNumber">
                    Card number
        </div>
      
        <div class="dropdown-option " tabindex="0" data-value="cardNameAsc">
                    Card name (A-Z)
        </div>

        <div class="dropdown-option " tabindex="0" data-value="cardNameDesc">
                    Card name (Z-A)
        </div>

        <div class="dropdown-option " tabindex="0" data-value="rarityDesc">
                    Rarity (desc)
        </div>

        <div class="dropdown-option " tabindex="0" data-value="rarityAsc">
                    Rarity (asc)
        </div>

        <div class="dropdown-option " tabindex="0" data-value="marketPriceDesc">
                    Market price (desc)
        </div>

        <div class="dropdown-option " tabindex="0" data-value="marketPriceAsc">
                    Market price (asc)
        </div>

        <div class="dropdown-option " tabindex="0" data-value="pokedexNumber">
                    Pokédex number
        </div>

                </div>

  </div>

</div>

    </div>
    
    <div class="card-display-option">

      <label>Show</label>

    <button type="button" class="
        dropdown-toggle
        button button-link-like-alt      " data-toggle="dropdown" data-target="#dropdown-257080707">
      <span aria-hidden="true" class="dropdown-toggle-caret"></span>
      Images
    </button>

<div id="dropdown-257080707" class="
    dropdown
          dropdown-selectable
        card-display-option-dropdown  " data-toggle-text-separator=", " data-query-string-key="displayAs">

  <div class="dropdown-menu">

    <div class="dropdown-menu-content">
    
        <div class="dropdown-option " tabindex="0" data-value="list">
                    List
        </div>

        <div class="dropdown-option selected" tabindex="0" data-value="images">
                    Images
        </div>

                </div>

  </div>

</div>

    </div>

  </div>

      <div id="card-image-grid">

  </div>
      `
    }
  }

  let RegionContainer = document.querySelector("#tcg-region-links-button-group");

  if (RegionContainer) {
    const schnLink = document.createElement("a");

    const url = window.location.pathname;
    if (url.match(/\/sets\/(?!\d)/)) {
      // if we are not INSIDE a set currently (on the set homepage)
      schnLink.href = "/sets/schn";
    } else if (url.match(/\/sets\/\d+/)) {
      // if we are INSIDE a set currently
      schnLink.href = "/cards/schn";
    } else if (url.includes("/dashboard/")) {
      schnLink.href = "/dashboard/schn";
    } else if (url.includes("/cards/")) {
      schnLink.href = "/cards/schn";
    } else {
      schnLink.href = "/pluspluserror";
    }

    if (window.location.pathname === "/sets/schn") {
      schnLink.className = "tcg-region-links-button-group-link button button-plain-alt active";
      console.log("Changed SCHN button to active ✅")
    } else {
      schnLink.className = "tcg-region-links-button-group-link button button-plain-alt";
    }

    console.log(window.location.pathname);

    schnLink.setAttribute("data-tcg-region-id", "3");
    schnLink.setAttribute("data-link-visitor-disabled", "");
    schnLink.innerText = "S. Chinese";

    RegionContainer.appendChild(schnLink);
    console.log("S. Chinese button made (" + schnLink.href + ") ✅");

    if (window.location.pathname === "/sets/schn") {
      const schnSetsPageTitle = "Pokémon TCG Sets (Simplified Chinese) - TCGCollector";
      if (document.title !== schnSetsPageTitle) {
        document.title = schnSetsPageTitle;
      }
      console.log("Changed Page Title to " + schnSetsPageTitle + " ✅")
    }
  }

  function drawSetCode(text) {
    const targetWidth = 60;
    const targetHeight = 40;
    const padding = 5;
    const scale = 10;

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth * scale;
    canvas.height = targetHeight * scale;
    const ctx = canvas.getContext("2d");

    ctx.scale(scale, scale);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.strokeRect(1, 1, targetWidth - 2, targetHeight - 2);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";

    let fontSize = targetHeight;
    let spacing = 2;
    let fits = false;
    let chars, totalWidth, textHeight;

    while (fontSize > 5 && !fits) {
      ctx.font = `bold ${fontSize}px 'Gill Sans MT Condensed', sans-serif`;

      chars = text.split("");
      totalWidth =
          chars.reduce((w, ch) => w + ctx.measureText(ch).width, 0) +
          (chars.length - 1) * spacing;

      textHeight =
          ctx.measureText("M").actualBoundingBoxAscent +
          ctx.measureText("M").actualBoundingBoxDescent;

      if (
          totalWidth <= targetWidth - padding * 2 &&
          textHeight <= targetHeight - padding * 2
      ) {
        fits = true;
      } else {
        fontSize -= 1;
      }
    }

    const total = totalWidth;
    let x = (targetWidth - total) / 2;
    const y = targetHeight / 2;

    for (const ch of chars) {
      const charWidth = ctx.measureText(ch).width;
      ctx.fillText(ch, x + charWidth / 2, y);
      x += charWidth + spacing;
    }

    return canvas.toDataURL("image/png");
  }

  let schn_eras_data
  let schn_sets_data
  let schn_cards_data

  async function loadSCHNData() {
    try {
      if (window.location.pathname === "/sets/schn") {
        {
          const {data} = await supabase.from("schn_eras").select("id, name");
          schn_eras_data = data;
        }
        {
          const {data} = await supabase.from("schn_sets").select("id, name, era, release_date, total_cards, total_cards_variants, set_code, set_price, set_image_url, set_path");
          schn_sets_data = data;
        }

        const setsFoundContainer = document.querySelector("#set-search-result-title");
        let setsFoundCount = 0;
        if (setsFoundContainer) {
          setsFoundContainer.innerHTML = "";

          setsFoundCount += schn_sets_data.length;

          let schnHTMLElements = `
            <span id="set-search-result-title-count">
              ${setsFoundCount}
            </span>

            <span id="set-search-result-title-name">
              sets found</span>
            </div>
  `;

          setsFoundContainer.innerHTML += schnHTMLElements;
        }

        const schnNavJumpLinksContainer = document.querySelector("#expansion-series-nav-jump-links");
        if (schnNavJumpLinksContainer) {
          schnNavJumpLinksContainer.innerHTML = "";

          schn_eras_data.forEach(era => {
            let schnHTMLElements = `
            <a href="#${era.name.toLowerCase().replace(/\s+/g, "-")}" title="Jump to '${era.name.toLowerCase().replace(/\s+/g, "-")}'" aria-label="Jump to '${era.name.toLowerCase().replace(/\s+/g, "-")}'" class="expansion-series-nav-jump-link">
              ${era.name}
            </a>
  `;
            schnHTMLElements += `</div></div>`;

            schnNavJumpLinksContainer.innerHTML += schnHTMLElements;
          });
        }

        const schnRepDataContainer = document.querySelector("#set-logo-grids");
        if (schnRepDataContainer) {
          schnRepDataContainer.innerHTML = ""; // clear existing elements

          schn_eras_data.forEach(era => {
            let schnHTMLElements = `
    <div id="${era.name.toLowerCase().replace(/\s+/g, "-")}" class="set-logo-grid">
      <h2 class="set-logo-grid-title">${era.name}</h2>
      <div class="set-logo-grid-items">
  `;

            const schnSetElements = schn_sets_data
                .filter(set => set.era === era.name)

                // sort newest to oldest as default
                .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

            if (schnSetElements.length === 0) {
              schnHTMLElements += `<p>No sets found for this era.</p>`;
            } else {
              schnSetElements.forEach(set => {
                schnHTMLElements += `
        <div class="set-logo-grid-item set-has-cards set-has-code set-has-symbol">
          <div class="set-logo-grid-item-header">
            <img src="${drawSetCode(set.set_code)}" 
                 srcset="${drawSetCode(set.set_code)} 25w, ${drawSetCode(set.set_code)} 46w" 
                 loading="eager" 
                 alt="${set.name}" 
                 width="25" 
                 height="14" 
                 class="set-symbol set-logo-grid-item-set-symbol">

            <span class="set-logo-grid-item-set-name-container">
              <a href="/sets/${set.set_path}" title="${set.name}" class="set-logo-grid-item-set-name">
                ${set.name}
              </a>
              <span class="set-logo-grid-item-set-code">${set.set_code}</span>
            </span>
          </div>

          <div class="set-logo-grid-item-body">
            <a href="/sets/${set.set_path}" class="set-logo-grid-item-set-logo-container">
              <img src="${set.set_image_url}" 
                   srcset="${set.set_image_url} 519w" 
                   loading="eager" 
                   alt="${set.name}" 
                   width="250" 
                   height="60" 
                   class="set-logo-grid-item-set-logo is-wider-than-reference">
            </a>

            <div class="set-logo-grid-item-text-content">
              <div class="set-logo-grid-item-release-date">${set.release_date}</div>
              <div class="set-logo-grid-item-price">
                <a href="/pluspluserror" rel="external nofollow" target="_blank" title="View card prices" aria-label="View card prices">$—</a>
              </div>
            </div>
          </div>

          <div class="set-logo-grid-item-footer">
            <div class="set-logo-grid-item-status">
              <div class="progress set-logo-grid-item-status-progress" style="--progress-percentage: 0%;">
                <div class="progress-label">0/${set.total_cards_variants}</div>
                <div class="progress-percentage">0%</div>
                <div aria-hidden="true" class="progress-bar"></div>
              </div>
            </div>

            <button type="button" 
                    class="set-like-card-collection-details-drawer-show-button set-logo-grid-item-collection-details-drawer-show-button button button-small button-plain"
                    data-set-like-id="${set.id}" data-set-mode="allCardVariants">
              <span aria-hidden="true" class="button-icon fa-solid fa-chart-simple"></span>
              View details
            </button>
          </div>
        </div>
      `;
              });
            }

            schnHTMLElements += `</div></div>`;

            schnRepDataContainer.innerHTML += schnHTMLElements;
          });
        }
      } else if (window.location.pathname.match(/^\/sets\/(?!40000)[4-9]\d{4}(?:\/|$)/)) {
        {
          const {data} = await supabase.from("schn_sets").select("name, set_path, set_code, total_cards_variants");
          schn_sets_data = data;
        }
        {
          const {data} = await supabase.from("schn_cards").select("set_name, card_name, card_number, card_price, card_path, card_image_url");
          schn_cards_data = data;
        }

        const schnSetPathData = window.location.pathname.match(/^\/sets\/([^/]+\/[^/]+)/);
        const schnCurrentSetRowData = schn_sets_data.find(row => row.set_path === schnSetPathData[1]);
        const schnCurrentSetCards = schn_cards_data.filter(
            card => card.set_name === schnCurrentSetRowData.name
        );

        const schnSetTitleDetailsContainer = document.querySelector("#card-search-result-title");
        if (schnSetTitleDetailsContainer) {
          schnSetTitleDetailsContainer.innerHTML = "";

          let schnHTMLElements = `
            <img src="${drawSetCode(schnCurrentSetRowData.set_code)}" srcset="${drawSetCode(schnCurrentSetRowData.set_code)} 25w, ${drawSetCode(schnCurrentSetRowData.set_code)} 50w, ${drawSetCode(schnCurrentSetRowData.set_code)} 55w" loading="eager" alt="${schnCurrentSetRowData.name}" width="25" height="14" sizes="(max-width: 25px) 100vw, 25px" id="card-search-result-title-set-symbol" class="set-symbol ">
            
            <span id="card-search-result-title-text">
                <span id="card-search-result-title-set-like-name">${schnCurrentSetRowData.name}</span>
                <span id="card-search-result-title-set-code">${schnCurrentSetRowData.set_code}</span>
  `;

          schnSetTitleDetailsContainer.innerHTML += schnHTMLElements;
        }

        const schnCardCollectionProgContainer = document.querySelector("#card-search-result-set-like-card-collection-progress");
        if (schnCardCollectionProgContainer) {
          schnCardCollectionProgContainer.innerHTML = "";

          schnCardCollectionProgContainer.className = "progress progress-horizontal";
          schnCardCollectionProgContainer.style.setProperty("--progress-percentage", "0%");

          let schnHTMLElements = `
            <div class="progress-label">  0/${schnCurrentSetRowData.total_cards_variants}
                </div>
            <div class="progress-percentage">0%</div>
            <div aria-hidden="true" class="progress-bar"></div>
          </div>
  `;

          schnCardCollectionProgContainer.innerHTML += schnHTMLElements;
        }

        const schnCardGridContainer = document.querySelector("#card-image-grid");
        if (schnCardGridContainer) {
          schnCardGridContainer.innerHTML = "";
          schnCardGridContainer.style.setProperty("--card-image-max-width", "320px");

          const cards = schnCurrentSetCards;
          const batchSize = 30;
          let i = 0;

          function renderBatch() {
            const frag = document.createDocumentFragment();

            for (let end = Math.min(i + batchSize, cards.length); i < end; i++) {
              const card = cards[i];
              const id = card.card_path.match(/^(\d+)(?=\/)/)[1];
              const div = document.createElement("div");
              div.className = "card-image-grid-item card-search-result-item has-image";

              div.innerHTML = `
      <a href="/cards/${card.card_path}" 
         title="${card.card_name} (${card.set_name} ${card.card_number}/${schnCurrentSetRowData.total_cards_variants})" 
         class="card-image-grid-item-link">

        <div class="card-image-grid-item-card-title">
          ${card.card_name} (${card.set_name} ${card.card_number}/${schnCurrentSetRowData.total_cards_variants})
        </div>   
                
        <img src="${card.card_image_url}" 
             srcset="${card.card_image_url} 320w, ${card.card_image_url} 640w, ${card.card_image_url} 868w" 
             loading="lazy" 
             alt="${card.card_name} (${card.set_name} ${card.card_number}/${schnCurrentSetRowData.total_cards_variants})" 
             class="card-image-grid-item-image">
              
        <div class="card-image-grid-item-info-overlay-text">
          <span>${card.card_number}/${schnCurrentSetRowData.total_cards_variants}</span>
        </div>

        <div class="card-image-grid-item-info-overlay-expansion-symbol-container">
          <img src="${drawSetCode(schnCurrentSetRowData.set_code)}" 
               srcset="${drawSetCode(schnCurrentSetRowData.set_code)} 25w, ${drawSetCode(schnCurrentSetRowData.set_code)} 50w, ${drawSetCode(schnCurrentSetRowData.set_code)} 55w" 
               loading="lazy" 
               alt="${schnCurrentSetRowData.name}" 
               class="set-symbol">
        </div>
      </a>

      <div class="card-image-controls">
        <div class="card-image-controls-item">
          <span class="card-image-controls-item-rarity">—</span>

          <button type="button" class="card-price-details-modal-show-button card-image-controls-item-price button button-link-like" 
                  data-card-id="${id}">
            $${card.card_price ?? '—'}
          </button>

          <button type="button" class="card-wishlist-toggle-button card-wishlist-toggle-button-with-icon-only" 
                  data-card-id="${id}">
            <span class="fa-solid fa-heart"></span>
          </button>
        </div>

        <div class="card-collection-card-controls card-image-controls-item"
             data-card-id="${id}"
             data-full-card-name-without-tcg-region="${card.card_name} (${card.set_name} ${card.card_number}/${schnCurrentSetRowData.total_cards_variants})">

          <button type="button" title="View my collection entries" aria-label="View my collection entries" class="card-collection-card-controls-indicators">
            <span aria-hidden="true" class="card-collection-card-indicator card-collection-card-indicator-standard-set card-collection-card-indicator-with-dot"></span>
          </button>

          <div class="number-spinner card-collection-card-controls-number-spinner" data-min-range="0">
            <button type="button" title="Decrement the number" aria-label="Decrement the number" class="number-spinner-button number-spinner-decrement-button">
              <span aria-hidden="true" class="fa-solid fa-minus"></span>
            </button>

            <span class="number-spinner-value">0</span>

            <button type="button" title="Increment the number" aria-label="Increment the number" class="number-spinner-button number-spinner-increment-button">
              <span aria-hidden="true" class="fa-solid fa-plus"></span>
            </button>
          </div>
  
          <button type="button" title="Show more options" aria-label="Show more options" class="card-collection-card-controls-dropdown-toggle dropdown-toggle">
            <span aria-hidden="true" class="fa-solid fa-ellipsis-vertical"></span>
          </button>
        </div>
      </div>
    `;

              frag.appendChild(div);
            }

            schnCardGridContainer.appendChild(frag);

            if (i < cards.length) {
              requestIdleCallback(renderBatch);
            } else {
              schnCardGridContainer.querySelectorAll("img.card-image-grid-item-image").forEach(img => {
                if (!img.complete || !img.naturalWidth) {
                  img.addEventListener("error", () => (img.src = img.src)); // retry failed ones
                }
              });
            }
          }

          requestIdleCallback(renderBatch);
        }
      }
    } catch (err) {
      console.error("Database error:", err, " ❌");
    }
  }

  loadSCHNData();
}

let sealedPacksInjected = false;
let sealedPacksEnabled
function injectSealedPacks() {
  // don't run again if already ran on the page only if the page IS reset
  if (sealedPacksInjected) return;
  sealedPacksInjected = true;

  if (window.location.pathname.match(/^\/sets\/\d+(?:\/|$)/)) {
    // We will inject the display option first.
    const displaySealedPacksButtonContainer = document.querySelector("#card-display-options-container");
    if (displaySealedPacksButtonContainer) {
      const sealedPackDropdownElement = document.createElement("button");
      sealedPackDropdownElement.className = "sealed-pack-display-option";
      sealedPackDropdownElement.textContent = "Sealed Packs";

      sealedPacksEnabled = true;
      sealedPackDropdownElement.addEventListener("click", () => {
        sealedPacksEnabled = !sealedPacksEnabled;
        if (sealedPacksEnabled) {
          sealedPackDropdownElement.classList.remove("disabled");
        } else {
          sealedPackDropdownElement.classList.add("disabled");
        }
      });

      displaySealedPacksButtonContainer.appendChild(sealedPackDropdownElement);
    }

    let sealed_pack_data

    async function loadSealedPackData() {
      try {
        const {data} = await supabase.from("sealed_packs").select("pack_name, pack_era, pack_release_date, pack_price, pack_variants, pack_image_url");
        sealed_pack_data = data;

        const imageGridContainer = document.querySelector("#card-image-grid");

        const checkImageGridReady = setInterval(() => {
          if (imageGridContainer && imageGridContainer.children.length > 0) {
            clearInterval(checkImageGridReady);

            const currentSetName = document.getElementById("card-search-result-title-set-like-name").textContent;

            const currentSetPack = sealed_pack_data.filter(
                pack => pack.pack_name === currentSetName
            );

            currentSetPack.forEach(pack => {
              const sealedPackElement = document.createElement("div");
              sealedPackElement.className = "sealed-pack";
              sealedPackElement.innerHTML = `
<div class="pack">
  <div class="shimmer"></div>

  <div class="pack-collection-controls">
    <div class="card-collection-card-controls">

      <button
        type="button"
        title="View my collection entries"
        aria-label="View my collection entries"
        class="card-collection-card-controls-indicators">
        <span
          aria-hidden="true"
          class="card-collection-card-indicator card-collection-card-indicator-standard-set card-collection-card-indicator-with-dot">
        </span>
      </button>

      <div class="number-spinner pack-collection-controls-number-spinner" data-min-range="0">
        <button
          type="button"
          title="Decrement the number"
          aria-label="Decrement the number"
          class="number-spinner-button number-spinner-decrement-button">
          <span aria-hidden="true" class="fa-solid fa-minus"></span>
        </button>
        <span class="number-spinner-value">0</span>
        <button
          type="button"
          title="Increment the number"
          aria-label="Increment the number"
          class="number-spinner-button number-spinner-increment-button">
          <span aria-hidden="true" class="fa-solid fa-plus"></span>
        </button>
      </div>

      <button
        type="button"
        title="Show more options"
        aria-label="Show more options"
        class="card-collection-card-controls-dropdown-toggle dropdown-toggle">
        <span aria-hidden="true" class="fa-solid fa-ellipsis-vertical"></span>
      </button>
      
      <div
        class="card-collection-card-controls-dropdown dropdown"
        data-menu-to-toggle-min-offset-px="2"
        data-force-menu-to-toggle-min-offset="true">
        
        <div class="dropdown-menu">
          <div class="dropdown-menu-arrow"></div>

          <div class="dropdown-menu-content">
            <button
              type="button"
              class="card-collection-card-details-modal-show-button dropdown-option">
              <span class="dropdown-option-left-item-container">
                <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-list-ul fa-fw"></span>
              </span>
              View collection entries
            </button>

            <button
              type="button"
              class="card-price-details-modal-show-button dropdown-option"
              data-card-id="51065"
              data-full-card-name-without-tcg-region="Bulbasaur (Mega Evolution 001/132)">
              <span class="dropdown-option-left-item-container">
                <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-dollar-sign fa-fw"></span>
              </span>
              View prices
            </button>

            <div class="dropdown-divider"></div>

            <button
              type="button"
              class="card-collection-card-controls-add-card-variant-button dropdown-option add-to-card-collection-mode-only"
              data-card-variant-type-id="1">
              <span class="dropdown-option-left-item-container">
                <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-plus fa-fw"></span>
              </span>
              Normal
              <span class="dropdown-option-right-item-container">
                <span class="card-collection-card-controls-dropdown-option-badge badge card-collection-card-controls-dropdown-option-badge-standard-set">0</span>
              </span>
            </button>

            <button
              type="button"
              class="card-collection-card-controls-add-card-variant-button dropdown-option add-to-card-collection-mode-only"
              data-card-variant-type-id="2">
              <span class="dropdown-option-left-item-container">
                <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-plus fa-fw"></span>
              </span>
              Reverse Holo
              <span class="dropdown-option-right-item-container">
                <span class="card-collection-card-controls-dropdown-option-badge badge card-collection-card-controls-dropdown-option-badge-parallel-set">0</span>
              </span>
            </button>

            <div class="dropdown-divider add-to-card-collection-mode-only"></div>

            <button
              type="button"
              class="card-collection-add-card-entry-modal-show-button dropdown-option add-to-card-collection-mode-only"
              data-card-id="51065">
              <span class="dropdown-option-left-item-container">
                <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-plus fa-fw"></span>
              </span>
              Add with more options
            </button>

            <button
              type="button"
              class="card-collection-add-card-entry-modal-show-button dropdown-option add-to-card-collection-mode-only"
              data-card-id="51065"
              data-is-card-grade-active="true">
              <span class="dropdown-option-left-item-container">
                <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-award fa-fw"></span>
              </span>
              Add graded card
            </button>

            <div class="dropdown-divider add-to-card-collection-mode-only"></div>

            <button
              type="button"
              class="which-card-variant-modal-show-button dropdown-option add-to-card-collection-mode-only"
              data-card-id="51065"
              data-full-card-name-without-tcg-region="Bulbasaur (Mega Evolution 001/132)">
              <span class="dropdown-option-left-item-container">
                <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-question fa-fw"></span>
              </span>
              Which variant do I have?
            </button>

            <button
              type="button"
              class="user-card-note-edit-button dropdown-option"
              data-card-id="51065"
              data-full-card-name-without-tcg-region="Bulbasaur (Mega Evolution 001/132)">
              <span class="dropdown-option-left-item-container">
                <span aria-hidden="true" class="user-card-note-edit-button-icon fa-solid fa-note-sticky dropdown-option-side-item-icon fa-fw"></span>
              </span>
              Add note
            </button>

            <div class="dropdown-divider"></div>

            <a href="/account/settings/card-collection" class="dropdown-option">
              <span class="dropdown-option-left-item-container">
                <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-gear fa-fw"></span>
              </span>
              Change collection settings
            </a>

            <div class="dropdown-divider"></div>

            <button type="button" class="copy-full-card-name-button dropdown-option">
              <span class="dropdown-option-left-item-container">
                <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-clipboard fa-fw"></span>
              </span>
              Copy full card name
            </button>

            <button type="button" class="copy-card-id-button dropdown-option">
              <span class="dropdown-option-left-item-container">
                <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-clipboard fa-fw"></span>
              </span>
              Copy card ID
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
      `;

              imageGridContainer.prepend(sealedPackElement);

              const styles = document.createElement('style')
              styles.innerHTML = `
            .sealed-pack .pack {
              width: 100%;
              height: 100%;
              border-radius: 1px;
              background-image: url("${pack.pack_image_url}");
              background-size: cover;
              background-position: center;
              overflow: visible !important;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
              transition: transform 0.2s ease;
              position: relative;
            }


            .sealed-pack .pack .shimmer {
              position: absolute;
              inset: 0;
              background: linear-gradient(120deg, rgba(255,255,255,0.3), transparent 60%);
              opacity: 0;
              transition: opacity 0.2s;
            }

            .sealed-pack .pack:hover .shimmer {
              opacity: 1;
            }
            
            .pack-collection-controls .card-collection-card-controls {
              position: absolute;
              bottom: 8px;
              left: 50%;
              transform: translateX(-50%); /* centers it horizontally */
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              background: rgba(255, 255, 255, 0.9);
              border-radius: 6px;
              padding: 4px 8px;
              opacity: 0;
              pointer-events: none;
              transition: opacity 0.3s ease;
            }
            
            .sealed-pack .pack:hover .pack-collection-controls .card-collection-card-controls {
              opacity: 1;
              pointer-events: auto;
            }
            
            .card-collection-card-controls-dropdown.dropdown.shown .dropdown-menu {
              position: absolute;
              z-index: 9999;
            }
            
            .card-collection-card-controls-dropdown.dropdown .dropdown-menu {
              position: absolute;
              z-index: 9999;
            }
            
            .number-spinner.pack-collection-controls-number-spinner .number-spinner-value {
              color: black;
            }
    `;

              document.head.appendChild(styles)

              document.querySelectorAll(".sealed-pack .pack").forEach(pack => {
                let mouseX = 0, mouseY = 0;
                let currentX = 0, currentY = 0;
                let animating = false;

                function animate() {
                  if (!animating) return;

                  currentX += (mouseX - currentX) * 0.6;
                  currentY += (mouseY - currentY) * 0.6;

                  pack.style.transform = `rotateX(${-currentY}deg) rotateY(${currentX}deg) scale(1.05)`;

                  requestAnimationFrame(animate);
                }

                pack.addEventListener("mousemove", (e) => {
                  const rect = pack.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;

                  mouseX = ((x - centerX) / centerX) * 10;
                  mouseY = ((y - centerY) / centerY) * 10;

                  if (!animating) {
                    animating = true;
                    requestAnimationFrame(animate);
                  }
                });

                pack.addEventListener("mouseleave", () => {
                  animating = false;
                  pack.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
                });

                function updateSealedPackVisibility() {
                  sealedPackElement.style.display = sealedPacksEnabled ? "block" : "none";
                }

                setInterval(() => {
                  updateSealedPackVisibility();
                }, 900); // 0.9 secs
              });
            });
          }
        }, 200); // 0.2 secs
      } catch (err) {
        console.error("Database error:", err, " ❌");
      }
    }

    loadSealedPackData()
  }
}

async function convertPrice(element, currency) {
  if (!element || !element.textContent) return;

  const converter = new Converter();

  const text = element.textContent.trim();
  const match = text.match(/\$?\s?(\d+(?:\.\d+)?)/);
  if (!match) return;

  const amount = parseFloat(match[1]);
  if (isNaN(amount)) return;

  let newAmount = amount;

  if (currency.toUpperCase() !== "USD") {
    try {
      newAmount = await converter.convert(amount, "USD", currency);
    } catch (err) {
      console.error("Currency conversion failed: ", err, " ❌");
      return;
    }
  }

  const rounded = Math.round(newAmount);
  element.textContent = `$${rounded} ${currency.toUpperCase()}`;
}

// run all these functions once
manageUserData()
injectSimplifiedChinese();
injectSealedPacks();

const priceCurrency = "CAD" // Change this to your currency to change market price on dashboard or just "USD" to do nothing.
if (window.location.pathname.includes("/dashboard")) {
  const elements = document.querySelectorAll(".dashboard-card-text");

  for (const el of elements) {
    const text = el.textContent?.trim() || "";
    if (text.startsWith("$")) {
      await convertPrice(el, priceCurrency || "USD");
    }
  }
}

function enableDarkMode() {
  const styles = document.createElement('style')
  styles.innerHTML = `
  @media (prefers-color-scheme: dark) {
    body {
      background-color: #313131;
      color: #efefef;
    }

    .list-group>.list-group-heading, .list-group>.list-group-item {
      background-color: #424242;
      border-color: #757575;
      color: #cecece;
    }

    .button-plain-alt, .button-plain-alt.disabled, .button-plain-alt:disabled {
      background-color: #424242;
      border-color: #757575;
      color: #cecece;
    }

    .button-plain, .button-plain.disabled, .button-plain:disabled {
      background-color: #424242;
      border-color: #757575;
      color: #cecece;
    }

    .button-plain>.button-icon {
      color: #fa7035;
    }

    .audit-log-list-group-item-datetime {
      color: #cecece;
    }

    .expansion-logo-grid-item-price:not(a), .expansion-logo-grid-item-release-date {
      color: #cecece;
    }

    .radio-label {
      color: #cecece;
    }

    .progress>.progress-label {
      color: #cecece;
    }
    
    /* ___________________ */
    /* | Nico added this | */
    
    #expansion-series-nav {
      background-color: #313131;
    }
    
    #page-header {
      background-color: #313131;
    }
    
    #page-header-title {
      color: #ffffff;
    }
    
    #page-content-title {
      color: #ffffff;
    }
    
    #premium-pricing-banner {
      background-color: #313131;
    }
    
    #premium-faq-banner {
      background-color: #313131;
    }
    
    .premium-pricing-banner-billing-cycle-card-title {
      color: #1b1b1b;
    }
    
    .modal-header {
      background-color: #282828;
      color: #cecece;
    }
    
    .modal-title {
      color: #ffffff;
    }
    
    .modal-body {
      background-color: #282828;
    }
    
    .modal-footer {
      background-color: #282828;
    }
    
    .form-label {
      color: #ffffff;
    }
    
    .form-label.required {
      color: #ffffff;
    }
    
    .switch-label {
      color: #ff6105;
    }
    
    .checkbox-label {
      color: #ffffff;
    }
    
    .dropdown-text {
      color: #ffc6a0;
    }
    
    .message-bar-plain {
      background-color: #313131;
      color: #ffffff;
    }
    
    .sealed-pack-display-option {
      background-color: #4CAF50;
      border: 2px solid #388E3C;
      color: white;
      padding: 4px 30px;
      text-align: center;
      font-size: 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
    }

    .sealed-pack-display-option.disabled {
      background-color: #E57373;
      border-color: #D32F2F;
      cursor: not-allowed;
    }

    .sealed-pack-display-option:hover:not(.disabled) {
      background-color: #45A049;
      border-color: #2E7D32;
      transform: scale(1.03);
    }

    .sealed-pack-display-option.disabled:hover {
      background-color: #EF9A9A;
      border-color: #B71C1C;
      transform: scale(0.9);
    }

    .sealed-pack-display-option:focus {
      outline: none;
      box-shadow: 0 0 6px rgba(0,0,0,0.2);
    }
   
    /* |                 | */
    /* ___________________ */

    .progress>.progress-percentage {
      color: #cecece;
    }

    .progress>.progress-bar {
      background-color: black;
    }

    .form-control {
      background-color: #424242;
      border-color: #757575;
      color: #cecece;
    }

    .form-control:focus {
      border-color: #fa7035;
      outline: 0;
      background-color: #424242;
      color: #cecece;
    }

    .card-image-controls-item-rarity>.card-rarity-symbol {
      background-color: white;
    }

    .dropdown-menu, .dropdown-menu-arrow , .dropdown-menu-content {
      background-color: #424242;
      color: #cecece;
    }
    
    .number-spinner-value {
      color: white;
    }

    .drawer {
      background-color: #212121;
      color: #cecece;
    }

    .card-collection-expansion-details-drawer-card {
      background-color: #111;
    }

    a.card-collection-expansion-details-drawer-card, a.card-collection-expansion-details-drawer-card:focus, a.card-collection-expansion-details-drawer-card:hover {
      color: white;
    }

    .list-group .list-group-item-side-item-icon {
      color: #fa7035;
    }

    .card-image-grid-item-info-overlay-text {
      background-color: #535353;
      border-top-color: #fa7035;
    }
    
    .card-image-grid-item-info-overlay-text {
      color: #cecece;
      border-top-right-color: #fa7035;
    }

    .card-collection-card-indicator {
      background-color: #111;
    }

    .card-wishlist-toggle-button-icon {
      color: #535353;
    }

    .dropdown-option {
      color: #cecece;
    }
  }

  .button.collector {
    margin-left: 8px;
  }
  `
  document.head.appendChild(styles)
}

function handleGridAction(cols, gridStyles) {
  const gridItems = document.querySelectorAll('.card-image-grid-item')
  const pastPages = document.querySelectorAll('.newpagegrid')
  // Cleanup
  pastPages.forEach(el => {
    el.remove()
  })

  gridStyles.innerHTML = `
  @media (min-width: 960px) and (max-width: 1159.98px) {
    #card-image-grid {
      grid-template-columns: repeat(${cols}, minmax(0, 1fr));
      width: 720px;
    }

    .card-image-grid-item {
      width: 160px;
    }
  }

  @media (min-width: 1160px) {
    #card-image-grid {
      grid-template-columns: repeat(${cols}, minmax(0, 1fr));
      width: 720px;
    }

    .card-image-grid-item {
      width: 200px;
    }
  }

  div.newpagegrid hr {
    background-color: white;
  }

  div.newpagegrid hr.backside {
    opacity: 0.7;
  }
  `
  const frontPage = cols * cols
  const backPage = frontPage * 2
  gridItems.forEach((el, i) => {
    if (i % backPage === 0) {
      const newPageGrid = document.createElement('div')
      const pageNo = document.createElement('span')
      const hr = document.createElement('hr')
      pageNo.innerText = `Front ${Math.floor(i / backPage) + 1}`
      hr.className = 'newpage'
      newPageGrid.className = 'newpagegrid'
      newPageGrid.appendChild(pageNo)
      newPageGrid.appendChild(hr)
      el.prepend(newPageGrid)
    } else if (i % frontPage === 0) {
      const newPageGrid = document.createElement('div')
      const pageNo = document.createElement('span')
      const hr = document.createElement('hr')
      pageNo.innerText = `Backside ${Math.floor(i / backPage) + 1}`
      hr.className = 'backside'
      newPageGrid.className = 'newpagegrid'
      newPageGrid.appendChild(pageNo)
      newPageGrid.appendChild(hr)
      el.prepend(newPageGrid)
    }
  })
}

function attachOrganizerButtons() {
  const organizer = document.querySelector('#card-display-options-container')
  if (!organizer) return // Bail early
  const gridStyles = document.createElement('style')
  const gridRow = document.createElement('div')

  const btn2x2 = document.createElement('a')
  btn2x2.innerHTML = ''
  btn2x2.className = 'button button-plain collector'
  btn2x2.role = 'button'
  btn2x2.onclick = () => { handleGridAction(2, gridStyles); sealedPacksEnabled = false } // Nico added sealedPacksEnabled to fix Sealed Packs bug
  const icon2x2 = document.createElement('span')
  icon2x2.innerText = '2x2'
  btn2x2.appendChild(icon2x2)
  gridRow.appendChild(btn2x2)

  const btn3x3 = document.createElement('a')
  btn3x3.className = 'button button-plain collector'
  btn3x3.role = 'button'
  btn3x3.onclick = () => { handleGridAction(3, gridStyles); sealedPacksEnabled = false } // Nico added sealedPacksEnabled to fix Sealed Packs bug
  const icon3x3 = document.createElement('span')
  icon3x3.innerText = '3x3'
  btn3x3.appendChild(icon3x3)
  gridRow.appendChild(btn3x3)

  const btnClear = document.createElement('a')
  btnClear.className = 'button button-plain collector'
  btnClear.role = 'button'
  btnClear.onclick = () => {
    const pastPages = document.querySelectorAll('.newpagegrid')
    // Cleanup
    pastPages.forEach(el => { el.remove() })
    gridStyles.innerHTML = `
    @media (min-width: 960px) and (max-width: 1159.98px) {
      #card-image-grid {}
    }
  
    @media (min-width: 1160px) {
      #card-image-grid {}
    }
    `
  }
  const iconClear = document.createElement('span')
  iconClear.innerText = 'Clear'
  btnClear.appendChild(iconClear)
  gridRow.appendChild(btnClear)

  const copyBulk = document.createElement('a')
  copyBulk.className = 'button button-plain collector'
  copyBulk.role = 'button'
  copyBulk.onclick = () => {
    const setCode = document.querySelector('#card-search-result-title-set-code').innerText.trim()
    const textEntries = []
    const cardsInGrid = document.querySelectorAll('.card-image-grid-item-card-title')
    for (const card of cardsInGrid.values()) {
      const cardText = card.innerText.trim()
      const parser = new RegExp('(.+?)\\(.+\\s(\\d+)/\\d+\\)')
      console.log(cardText, parser.exec(cardText))
      const [_, title] = parser.exec(cardText) // Nico removed the unused 'number' string
      textEntries.push(`1 ${title.trim()} [${setCode}]`)
    }
    console.log(textEntries.join('\n'))
    navigator.clipboard.writeText(textEntries.join('\n'))
    alert(`Copied ${cardsInGrid.length} cards to the clipboard`)
  }
  const iconCopy = document.createElement('span')
  iconCopy.innerText = 'Copy'
  copyBulk.appendChild(iconCopy)
  const cardSourceFilter = document.querySelector('#card-source-radios')
  cardSourceFilter.addEventListener('input', () => {
    setTimeout(() => {
      const organizer = document.querySelector('#card-display-options-container')
      organizer.append(gridStyles, gridRow)
    }, 500)
  })
  gridRow.appendChild(copyBulk)

  gridRow.className = 'card-display-option'
  organizer.append(gridStyles, gridRow)
}

// document.body.style.backgroundColor = 'black'
enableDarkMode()
attachOrganizerButtons()