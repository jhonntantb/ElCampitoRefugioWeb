import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { validateRechaptcha } from '../../../redux/actions/action';

const Recaptcha = () => {
  const recaptchaRef = useRef(null);
  const dispatch = useDispatch();

  const SITE_KEY =
    process.env.REACT_APP_CAPTCHA_SITE_KEY ||
    '6Ldejm4eAAAAAL3yYZx3drPfDQAq18ERmm8t1RLv';

  const onChange = () => {
    const token = recaptchaRef.current.getValue();
    if (token) {
      dispatch(validateRechaptcha(token));
    }
  };
  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={SITE_KEY}
      onChange={onChange}
    />
  );
};

export default Recaptcha;
