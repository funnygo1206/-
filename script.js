/* =========================================
   1. Supabase 연결
========================================= */

const SUPABASE_URL = "https://nswlaobmdatubsjbozaq.supabase.co";
const SUPABASE_KEY = "sb_publishable_sYrqlwyxaODYznK3uNO7sA_TcFseI5k";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================================
   2. 화면 요소 가져오기
========================================= */

const mainScreen = document.getElementById("main-screen");
const signupScreen = document.getElementById("signup-screen");
const loginScreen = document.getElementById("login-screen");
const searchScreen = document.getElementById("search-screen");


/* =========================================
   3. 메인 화면 버튼
========================================= */

const openLogin = document.getElementById("open-login");
const openSignup = document.getElementById("open-signup");
const openSearch = document.getElementById("open-search");


/* =========================================
   4. 뒤로가기 버튼
========================================= */

const loginBack = document.getElementById("login-back");
const signupBack = document.getElementById("signup-back");
const searchBack = document.getElementById("back-button");


/* =========================================
   5. 회원가입 요소
========================================= */

const signupSubmit = document.getElementById("signup-submit");
const signupMessage = document.getElementById("signup-message");


/* =========================================
   6. 로그인 요소
========================================= */

const loginSubmit = document.getElementById("login-submit");
const loginMessage = document.getElementById("login-message");


/* =========================================
   7. 모든 화면 숨기기
========================================= */

function hideAllScreens() {
    mainScreen.style.display = "none";
    signupScreen.style.display = "none";
    loginScreen.style.display = "none";
    searchScreen.style.display = "none";
    profileScreen.style.display = "none";
    mapScreen.style.display = "none";
}


/* =========================================
   8. 화면 전환
========================================= */

const profileScreen =
    document.getElementById("profile-screen");

const profileButton =
    document.getElementById("profile-button");

const profileBack =
    document.getElementById("profile-back");

const profileEmail =
    document.getElementById("profile-email");

const profileId =
    document.getElementById("profile-id");

const profileCreated =
    document.getElementById("profile-created");

/* 로그인 화면 열기 */
openLogin.addEventListener("click", function () {

    /* 이미 로그인 상태라면 로그아웃 */
    if (openLogin.dataset.loggedIn === "true") {
        logout();
        return;
    }

    hideAllScreens();
    loginScreen.style.display = "block";
});


/* 회원가입 화면 열기 */
openSignup.addEventListener("click", function () {

    hideAllScreens();
    signupScreen.style.display = "block";
});


/* 검색 화면 열기 */
openSearch.addEventListener("click", function () {

    hideAllScreens();
    searchScreen.style.display = "block";
});


/* 로그인 화면 → 메인 화면 */
loginBack.addEventListener("click", function () {

    hideAllScreens();
    mainScreen.style.display = "block";
});


/* 회원가입 화면 → 메인 화면 */
signupBack.addEventListener("click", function () {

    hideAllScreens();
    mainScreen.style.display = "block";
});


/* 검색 화면 → 메인 화면 */
searchBack.addEventListener("click", function () {

    hideAllScreens();
    mainScreen.style.display = "block";
});

/* 프로필 화면 → 메인 화면 */
profileBack.addEventListener("click", function () {

    hideAllScreens();
    mainScreen.style.display = "block";

});

profileButton.addEventListener("click", async function () {

    const {
        data: { user },
        error
    } = await supabaseClient.auth.getUser();

    if (error || !user) {
        alert("사용자 정보를 불러올 수 없습니다.");
        return;
    }

    profileEmail.textContent =
        user.email ?? "정보 없음";

    profileId.textContent =
        user.id ?? "정보 없음";

    if (user.created_at) {
        const createdDate =
            new Date(user.created_at);

        profileCreated.textContent =
            createdDate.toLocaleDateString("ko-KR");
    } else {
        profileCreated.textContent =
            "정보 없음";
    }

    hideAllScreens();
    profileScreen.style.display = "block";
});

/* =========================================
   9. 실제 회원가입
========================================= */

signupSubmit.addEventListener("click", async function () {

    const email =
        document.getElementById("signup-email").value.trim();

    const password =
        document.getElementById("signup-password").value;

    const passwordCheck =
        document.getElementById("signup-password-check").value;


    signupMessage.textContent = "";


    /* 빈칸 검사 */
    if (
        email === "" ||
        password === "" ||
        passwordCheck === ""
    ) {
        signupMessage.textContent =
            "모든 항목을 입력해주세요.";

        return;
    }


    /* 비밀번호 일치 확인 */
    if (password !== passwordCheck) {

        signupMessage.textContent =
            "비밀번호가 일치하지 않습니다.";

        return;
    }


    /* 비밀번호 길이 확인 */
    if (password.length < 6) {

        signupMessage.textContent =
            "비밀번호는 6자 이상 입력해주세요.";

        return;
    }


    /* Supabase 회원가입 */
    const { data, error } =
        await supabaseClient.auth.signUp({

            email: email,
            password: password

        });


    /* 오류 발생 */
    if (error) {

        signupMessage.textContent =
            "회원가입 실패: " + error.message;

        return;
    }


    /* 회원가입 성공 */
    signupMessage.textContent =
        "회원가입이 완료되었습니다! 이메일을 확인해주세요.";

});


/* =========================================
   10. 실제 로그인
========================================= */

loginSubmit.addEventListener("click", async function () {

    const email =
        document.getElementById("login-email").value.trim();

    const password =
        document.getElementById("login-password").value;


    loginMessage.textContent = "";


    /* 빈칸 검사 */
    if (email === "" || password === "") {

        loginMessage.textContent =
            "이메일과 비밀번호를 입력해주세요.";

        return;
    }


    /* Supabase 로그인 */
    const { data, error } =
        await supabaseClient.auth.signInWithPassword({

            email: email,
            password: password

        });


    /* 로그인 실패 */
    if (error) {

        loginMessage.textContent =
            "로그인 실패: 이메일 또는 비밀번호를 확인해주세요.";

        return;
    }


    /* 로그인 성공 */
    loginMessage.textContent =
        "로그인에 성공했습니다!";


    /* 잠시 후 메인 화면으로 이동 */
    setTimeout(function () {

        hideAllScreens();
        mainScreen.style.display = "block";

        updateLoginUI(data.user);

    }, 700);

});



/* =========================================
   11. 로그인 상태에 따라 화면 변경
========================================= */
function updateLoginUI(user) {

    if (user) {

        openLogin.textContent = "로그아웃";
        openLogin.dataset.loggedIn = "true";

        openSignup.style.display = "none";

        profileButton.style.display = "flex";

    } else {

        openLogin.textContent = "로그인";
        openLogin.dataset.loggedIn = "false";

        openSignup.style.display = "inline-block";

        profileButton.style.display = "none";
    }
}


/* =========================================
   12. 로그아웃
========================================= */

async function logout() {

    const { error } =
        await supabaseClient.auth.signOut();


    if (error) {

        alert("로그아웃에 실패했습니다.");

        return;
    }


    updateLoginUI(null);

    alert("로그아웃되었습니다.");
}


/* =========================================
   13. 페이지를 열었을 때 로그인 상태 확인
========================================= */

async function checkLogin() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    if (session) {

        updateLoginUI(session.user);

    } else {

        updateLoginUI(null);

    }
}


/* 웹페이지 시작 시 실행 */
checkLogin();


/* =========================================
   14. 로그인 상태가 변경될 때 자동 반영
========================================= */

supabaseClient.auth.onAuthStateChange(
    function (event, session) {

        if (session) {

            updateLoginUI(session.user);

        } else {

            updateLoginUI(null);

        }

    }
);

const mapScreen =
    document.getElementById("map-screen");

const openMap =
    document.getElementById("open-map");

const mapBack =
    document.getElementById("map-back");

    let map;


/* 근처 가게 찾아보기 */
openMap.addEventListener("click", function () {

    hideAllScreens();

    mapScreen.style.display = "block";

    showMap();
});


/* 지도 → 메인 화면 */
mapBack.addEventListener("click", function () {

    hideAllScreens();

    mainScreen.style.display = "block";
});


/* 지도 만들기 */
function showMap() {

    /* 이미 만들어진 지도라면 다시 만들지 않음 */
    if (map) {
        return;
    }

    const mapOptions = {

        /* 서울시청 좌표 */
        center: new naver.maps.LatLng(
            37.5665,
            126.9780
        ),

        zoom: 15
    };


    map = new naver.maps.Map(
        "map",
        mapOptions
    );


    /* 테스트용 마커 */
    const marker = new naver.maps.Marker({

        position: new naver.maps.LatLng(
            37.5665,
            126.9780
        ),

        map: map
    });
}