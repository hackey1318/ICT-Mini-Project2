import '../css/footer.css';

function Footer(){
    return(
        <>        
        <ul class="footer">
            <li id="footer-logo">
                <ul>
                    <li><a href="${pageContext.request.contextPath}/page/policies/privacy-policy">Privacy Policy</a></li>
                    <li><a href="${pageContext.request.contextPath}/page/policies/terms-of-use">Site Terms of Use</a></li>
                    <li><a href="${pageContext.request.contextPath}/page/policies/cookie-preferences">Cookie Preferences</a></li>
                </ul>
            </li>
                <li id="footer-contact">
                    {/* <p>e-mail.<a href="mailto:ieum@ieum.com">ieum@ieum.com</a><br/><br/><br/><br/>
                        Tel. <a href="tel:010-0000-0000">02-0000-0000</a></p>
                        <a href="https://www.kakao.com" target="_blank">
                        <img src="${pageContext.request.contextPath }/img/footer/footer_kakao.png" width='45' height='45'/></a>
                        <a href="https://www.instagram.com" target="_blank">
                        <img src="${pageContext.request.contextPath }/img/footer/footer_insta.png" width='45' height='45'/></a>
                        <a href="https://www.facebook.com" target="_blank">
                        <img src="${pageContext.request.contextPath }/img/footer/footer_facebook.png" width='45' height='45'/></a> */}
                </li>
            
                <li id="footer-copyright">
                    Copyright 2025 이음 Inc.&nbsp;&nbsp;&nbsp;&nbsp;
                </li>
            </ul>
        </>
    )
}

export default Footer;