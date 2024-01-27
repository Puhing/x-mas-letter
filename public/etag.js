function etag_pageview() {
    let link = new URL(window.location.href);
    gtag('event', 'pageview', {
        referral_url: document.referrer,
        page_url: link.pathname,
    });
}

function etag_mailbox_create(letter_count) {
    let link = new URL(window.location.href);
    gtag('event', 'mailbox_create', {
        referral_url: document.referrer,
        page_url: link.pathname,
        letter_count,
    });
}

function etag_sound_click(button_status) {
    let link = new URL(window.location.href);
    gtag('event', 'sound_click', {
        referral_url: document.referrer,
        page_url: link.pathname,
        button_status,
    });
}

function etag_welcome_pageview() {
    let link = new URL(window.location.href);
    gtag('event', 'welcome_pageview', {
        referral_url: document.referrer,
        page_url: link.pathname,
    });
}

function etag_login_click(login_method) {
    let link = new URL(window.location.href);
    gtag('event', 'login_click', {
        referral_url: document.referrer,
        page_url: link.pathname,
        login_method,
    });
}

function etag_signup_start(login_method) {
    let link = new URL(window.location.href);
    gtag('event', 'signup_start', {
        referral_url: document.referrer,
        page_url: link.pathname,
        login_method,
    });
}

function etag_signup(signup_date, login_method) {
    let link = new URL(window.location.href);
    gtag('event', 'signup', {
        referral_url: document.referrer,
        page_url: link.pathname,
        signup_date,
        login_method,
    });
}

function etag_login(login_method) {
    let link = new URL(window.location.href);
    gtag('event', 'login', {
        referral_url: document.referrer,
        page_url: link.pathname,
        login_method,
    });
}

function etag_mailbox_pageview(letter_count, is_login) {
    let link = new URL(window.location.href);
    gtag('event', 'mailbox_pageview', {
        referral_url: document.referrer,
        page_url: link.pathname,
        letter_count,
        is_login,
    });
}

function etag_mailbox_share_click() {
    let link = new URL(window.location.href);
    gtag('event', 'mailbox_share_click', {
        referral_url: document.referrer,
        page_url: link.pathname,
    });
}

function etag_mailbox_share(share_method) {
    let link = new URL(window.location.href);
    gtag('event', 'mailbox_share', {
        referral_url: document.referrer,
        page_url: link.pathname,
        share_method,
    });
}

function etag_mailbox_open() {
    let link = new URL(window.location.href);
    gtag('event', 'mailbox_open', {
        referral_url: document.referrer,
        page_url: link.pathname,
    });
}

function etag_mailbox_read(letter_type, letter_count) {
    let link = new URL(window.location.href);
    gtag('event', 'mailbox_read', {
        referral_url: document.referrer,
        page_url: link.pathname,
        letter_type,
        letter_count,
    });
}

function etag_mailbox_download() {
    let link = new URL(window.location.href);
    gtag('event', 'mailbox_download', {
        referral_url: document.referrer,
        page_url: link.pathname,
    });
}

function etag_mailbox_qwer(letter_count) {
    let link = new URL(window.location.href);
    gtag('event', 'mailbox_qwer', {
        referral_url: document.referrer,
        page_url: link.pathname,
        letter_count,
    });
}

function etag_mailbox_qwer_apply(letter_count) {
    let link = new URL(window.location.href);
    gtag('event', 'mailbox_qwer_apply', {
        referral_url: document.referrer,
        page_url: link.pathname,
        letter_count,
    });
}

function etag_mailbox_qwer_receive(qwer_letter_count) {
    let link = new URL(window.location.href);
    gtag('event', 'mailbox_qwer_receive', {
        referral_url: document.referrer,
        page_url: link.pathname,
        qwer_letter_count,
    });
}

function etag_mailbox_qwer_view(qwer_letter_title) {
    let link = new URL(window.location.href);
    gtag('event', 'mailbox_qwer_view', {
        referral_url: document.referrer,
        page_url: link.pathname,
        qwer_letter_title,
    });
}

function etag_mailbox_qwer_thankyou() {
    let link = new URL(window.location.href);
    gtag('event', 'mailbox_qwer_thankyou', {
        referral_url: document.referrer,
        page_url: link.pathname,
    });
}
function etag_mailbox_send(letter_count) {
    let link = new URL(window.location.href);
    gtag('event', 'mailbox_send', {
        referral_url: document.referrer,
        page_url: link.pathname,
        letter_count,
    });
}

function etag_write_pageview(visit_code, user_name) {
    let link = new URL(window.location.href);
    gtag('event', 'write_pageview', {
        referral_url: document.referrer,
        page_url: link.pathname,
        visit_code,
        user_name,
    });
}
function etag_write_text_click() {
    let link = new URL(window.location.href);
    gtag('event', 'write_text_click', {
        referral_url: document.referrer,
        page_url: link.pathname,
    });
}

function etag_write_voice_click() {
    let link = new URL(window.location.href);
    gtag('event', 'write_voice_click', {
        referral_url: document.referrer,
        page_url: link.pathname,
    });
}

function etag_write_voice_record(record_status) {
    let link = new URL(window.location.href);
    gtag('event', 'write_voice_record', {
        referral_url: document.referrer,
        page_url: link.pathname,
        record_status,
    });
}

function etag_write_voice_listen() {
    let link = new URL(window.location.href);
    gtag('event', 'write_voice_listen', {
        referral_url: document.referrer,
        page_url: link.pathname,
    });
}
function etag_write_voice_del() {
    let link = new URL(window.location.href);
    gtag('event', 'write_voice_del', {
        referral_url: document.referrer,
        page_url: link.pathname,
    });
}
function etag_write_complete(letter_type, is_login) {
    let link = new URL(window.location.href);
    gtag('event', 'write_complete', {
        referral_url: document.referrer,
        page_url: link.pathname,
        letter_type,
        is_login,
    });
}
