/* ========================================
   Include 공통 스크립트
   js/include.js
======================================== */

// 헤더/푸터 자동 로드
document.addEventListener('DOMContentLoaded', function() {
    // 현재 페이지가 관리자 페이지인지 확인
    const isAdminPage = window.location.pathname.includes('/admin/');
    
    if (isAdminPage) {
        // 관리자 페이지: 관리자 헤더/사이드바 로드
        loadAdminHeader();
        loadAdminSidebar();
    } else {
        // 일반 사용자 페이지: 일반 헤더/푸터 로드
        loadUserHeader();
        loadUserFooter();
        
        // 결제 페이지인 경우 결제 관련 기능 초기화
        if (window.location.pathname.includes('payment.html')) {
            initPaymentPage();
        }
    }
});

/* ========================================
   일반 사용자 페이지 Include
======================================== */

// 일반 헤더 로드
function loadUserHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) {
        console.warn('header-placeholder 요소를 찾을 수 없습니다.');
        return;
    }
    
    fetch('includes/header.html')
        .then(response => {
            if (!response.ok) throw new Error('헤더 로드 실패');
            return response.text();
        })
        .then(data => {
            headerPlaceholder.innerHTML = data;
            // DOM이 삽입된 후 초기화
            setTimeout(() => {
                initUserHeader();
            }, 0);
        })
        .catch(error => {
            console.error('헤더 로드 에러:', error);
            headerPlaceholder.innerHTML = '<p style="color:red;">헤더 로드 실패</p>';
        });
}

// 일반 푸터 로드
function loadUserFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) {
        console.warn('footer-placeholder 요소를 찾을 수 없습니다.');
        return;
    }
    
    fetch('includes/footer.html')
        .then(response => {
            if (!response.ok) throw new Error('푸터 로드 실패');
            return response.text();
        })
        .then(data => {
            footerPlaceholder.innerHTML = data;
        })
        .catch(error => {
            console.error('푸터 로드 에러:', error);
            footerPlaceholder.innerHTML = '<p style="color:red;">푸터 로드 실패</p>';
        });
}

// 일반 헤더 초기화 (모바일 메뉴 등)
function initUserHeader() {
    console.log('헤더 초기화 시작');
    
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    console.log('mobileMenuToggle:', mobileMenuToggle);
    console.log('navMenu:', navMenu);
    
    if (mobileMenuToggle && navMenu) {
        // 기존 이벤트 리스너 제거 (중복 방지)
        const newToggle = mobileMenuToggle.cloneNode(true);
        mobileMenuToggle.parentNode.replaceChild(newToggle, mobileMenuToggle);
        
        // 새로운 이벤트 리스너 등록
        newToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('햄버거 버튼 클릭됨');
            navMenu.classList.toggle('active');
            console.log('navMenu.classList:', navMenu.classList);
        });
        
        console.log('햄버거 메뉴 이벤트 리스너 등록 완료');
    } else {
        console.error('햄버거 메뉴 요소를 찾을 수 없습니다:', {
            mobileMenuToggle,
            navMenu
        });
    }
    
    // 메뉴 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        if (navMenu && 
            navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !document.getElementById('mobileMenuToggle').contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

/* ========================================
   결제 페이지 전용 기능
   PHP 연동 시: 아래 함수들을 서버사이드 로직으로 교체
======================================== */

// 결제 처리 — 프로토타입: 확인창 없이 결과 페이지로 직접 이동
// PHP 연동 시: PG사 결제 → 서버 검증 → 구매 이력 저장 → 리다이렉트
function processPayment(type) {
    if (type === 'basic')     location.href = 'result-basic.html';
    else if (type === 'incorrect') location.href = 'result-incorrect.html';
    else                      location.href = 'result-detail.html';
}

/* ========================================
   관리자 페이지 Include
======================================== */

// 관리자 헤더 로드
function loadAdminHeader() {
    const headerPlaceholder = document.getElementById('headerPlaceholder');
    if (!headerPlaceholder) return;
    
    fetch('../includes/admin-header.html')
        .then(response => {
            if (!response.ok) throw new Error('관리자 헤더 로드 실패');
            return response.text();
        })
        .then(data => {
            headerPlaceholder.innerHTML = data;
            initAdminHeader();
        })
        .catch(error => {
            console.error('관리자 헤더 로드 에러:', error);
            headerPlaceholder.innerHTML = '<p style="color:red;">헤더 로드 실패</p>';
        });
}

// 관리자 사이드바 로드
function loadAdminSidebar() {
    const sidebarPlaceholder = document.getElementById('sidebarPlaceholder');
    if (!sidebarPlaceholder) return;
    
    fetch('../includes/admin-sidebar.html')
        .then(response => {
            if (!response.ok) throw new Error('관리자 사이드바 로드 실패');
            return response.text();
        })
        .then(data => {
            sidebarPlaceholder.innerHTML = data;
            initAdminSidebar();
        })
        .catch(error => {
            console.error('관리자 사이드바 로드 에러:', error);
            sidebarPlaceholder.innerHTML = '<p style="color:red;">사이드바 로드 실패</p>';
        });
}

// 관리자 헤더 초기화
function initAdminHeader() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('adminSidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
}

// 관리자 사이드바 초기화
function initAdminSidebar() {
    // 서브메뉴 토글
    const navItems = document.querySelectorAll('.nav-item.has-submenu > .nav-link');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            
            // 다른 메뉴 닫기
            document.querySelectorAll('.nav-item.has-submenu').forEach(otherItem => {
                if (otherItem !== parent) {
                    otherItem.classList.remove('active');
                }
            });
            
            // 현재 메뉴 토글
            parent.classList.toggle('active');
        });
    });
    
    // 현재 페이지 활성화 표시
    highlightCurrentPage();
}

// 현재 페이지 하이라이트
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop(); // 파일명만 추출
    const links = document.querySelectorAll('.nav-link, .submenu a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href === currentPage) {
            // 링크 강조
            link.style.background = 'rgba(255, 255, 255, 0.15)';
            link.style.color = 'white';
            link.style.fontWeight = '700';
            
            // 부모 메뉴 열기
            const parentItem = link.closest('.nav-item.has-submenu');
            if (parentItem) {
                parentItem.classList.add('active');
            }
        }
    });
}

