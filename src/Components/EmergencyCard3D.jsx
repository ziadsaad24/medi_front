import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { CalendarDays, Droplets, ClipboardList, Ruler } from 'lucide-react';
import './EmergencyCard3D.css';
import { icons } from '../assets/icons';

// Local SVG Assets
const imgSubtract = icons.subtract;
const imgIcon = icons.healthcare;
const imgIcon1 = icons.shield;
const imgVector = icons.heartbeatWave;
const imgIdLogoIconPngSvg1 = icons.idCard;
const imgIcon2 = icons.warning;
const imgIcon3 = icons.userProfile;
const imgIcon4 = icons.security;
const backLogo = icons.logoPulse;
const backWave = icons.heartbeatWave;

const getDisplayValue = (value, fallback = '--') => {
  if (value === undefined || value === null) return fallback;
  const text = String(value).trim();
  return text ? text : fallback;
};

const getContactValue = (value) => {
  if (value === undefined || value === null) return 'لا يوجد';
  const text = String(value).trim();
  return text ? text : 'لا يوجد';
};

const getIntegerDisplayValue = (value, fallback = '--') => {
  const text = getDisplayValue(value, fallback);
  if (text === fallback) return fallback;

  const normalized = text.replace(/,/g, '.');
  const numericValue = Number(normalized);
  if (!Number.isNaN(numericValue)) {
    return String(Math.trunc(numericValue));
  }

  const decimalTextMatch = normalized.match(/^(-?\d+)(\.\d+)$/);
  if (decimalTextMatch) {
    return decimalTextMatch[1];
  }

  return text;
};

const EmergencyCard3D = ({ patientData, cardFrontRef, cardBackRef, isFlipped, onFlip, hideFlipButton = false, staticSide = null }) => {
  // Use external flip control if provided, otherwise use internal state
  const [internalFlipped, setInternalFlipped] = useState(false);
  const flipState = staticSide ? staticSide === 'back' : (isFlipped !== undefined ? isFlipped : internalFlipped);
  const handleFlip = onFlip || (() => setInternalFlipped(!internalFlipped));

  // Default data if not provided
  const data = patientData || {};

  const normalizedData = {
    name: getDisplayValue(data.name),
    id: getDisplayValue(data.medical_card_id),
    age: getDisplayValue(data.age),
    bloodType: getDisplayValue(data.bloodType),
    height: getIntegerDisplayValue(data.height),
    weight: getIntegerDisplayValue(data.weight),
    allergies: getContactValue(data.allergies),
    qrValue: data.qrValue || `https://medicare.com/patient/${getDisplayValue(data.id, 'unknown')}`,
    emergencyContact: {
      name: getContactValue(data.emergencyContact?.name),
      phone: getContactValue(data.emergencyContact?.phone),
    },
  };

  const emergencyContactText = (() => {
    const contactName = normalizedData.emergencyContact.name;
    const contactPhone = normalizedData.emergencyContact.phone;

    if (contactName === 'لا يوجد' && contactPhone === 'لا يوجد') {
      return 'لا يوجد';
    }

    if (contactName !== 'لا يوجد' && contactPhone !== 'لا يوجد') {
      return `${contactName} - ${contactPhone}`;
    }

    return contactName !== 'لا يوجد' ? contactName : contactPhone;
  })();

  const QRComp = QRCode?.default ? QRCode.default : QRCode;
  const nameWords = normalizedData.name.split(' ');

  return (
    <div className={`emergency-card-container ${staticSide ? `static-side-${staticSide}` : ''}`}>
      <div className={`emergency-card-3d ${flipState ? 'flipped' : ''}`}>
        
        {/* Front Side */}
        <div className="card-face card-front" ref={cardFrontRef}>
          {/* Background gradient */}
          <div className="card-bg-gradient" />
          
          {/* Logo Section - Top Left */}
          <div className="logo-section">
            <div className="logo-icon-box">
              <img src={imgIcon} alt="" className="logo-heart-icon" />
              <img src={imgIcon1} alt="" className="logo-heart-icon2" />
            </div>
            <p className="logo-text">MediCare</p>
          </div>

          {/* QR Code - Left Side */}
          <div className="qr-container">
            <QRComp
              value={normalizedData.qrValue}
              size={190}
              fgColor="#0f172a"
              bgColor="#ffffff"
              level="H"
            />
          </div>

          {/* Patient Name - Top Right */}
          <div className="name-section">
            <img src={imgIcon3} alt="" className="name-icon" />
            <p className="patient-name">
              <span className="name-first">{nameWords[0]}</span>
              {nameWords.length > 1 && <span className="name-rest"> {nameWords.slice(1).join(' ')}</span>}
            </p>
          </div>

          {/* ID Section - Below Name */}
          <div className="id-section">
            <p className="id-text">
              <span className="id-white">id:</span>
              <span className="id-dark">#{normalizedData.id}</span>
            </p>
            <img src={imgIdLogoIconPngSvg1} alt="" className="id-logo" />
          </div>

          {/* Patient Stats - Right Side */}
          <div className="stats-container">
            <div className="stat-box">
              <p className="stat-label">العمر</p>
              <p className="stat-value">{normalizedData.age}</p>
            </div>
            <div className="stat-box">
              <p className="stat-label">فصيلة الدم</p>
              <p className="stat-value">{normalizedData.bloodType}</p>
            </div>
            <div className="stat-box">
              <p className="stat-label">الطول</p>
              <p className="stat-value">{normalizedData.height}</p>
            </div>
            <div className="stat-box">
              <p className="stat-label">الوزن</p>
              <p className="stat-value">{normalizedData.weight}</p>
            </div>
          </div>

          {/* Side Icon Bar - Far Right */}
          <div className="icon-bar">
            <div className="bar-bg" />
            <div className="icon-item purple-bg">
              <CalendarDays size={28} strokeWidth={2} color="#AD46FF" />
            </div>
            <div className="icon-item red-bg">
              <Droplets size={28} strokeWidth={2} color="#FB2C36" />
            </div>
            <div className="icon-item blue-bg">
              <ClipboardList size={28} strokeWidth={2} color="#2B7FFF" />
            </div>
            <div className="icon-item teal-bg">
              <Ruler size={28} strokeWidth={2} color="#00BBA7" />
            </div>
          </div>

          {/* Allergy Alert Card */}
          <div className="alert-box allergy-box">
            <div className="alert-heading">
              <p className="alert-label red-label">الحساسية</p>
              <img src={imgIcon2} alt="" className="alert-icon-img" />
            </div>
            <div className="allergy-pill">
              <span className="red-dot" />
              <p className="allergy-text-content">{normalizedData.allergies}</p>
            </div>
          </div>

          {/* Emergency Contact Card */}
          <div className="alert-box contact-box">
            <div className="alert-heading">
              <p className="alert-label orange-label">اتصال الطوارئ</p>
              <img src={imgIcon4} alt="" className="alert-icon-img" />
            </div>
            <p className="contact-details">
              {emergencyContactText}
            </p>
          </div>

          {/* Bottom Wave */}
          <div className="wave-container">
            <img src={imgSubtract} alt="" className="wave-img" />
            <img src={imgVector} alt="" className="wave-line" />
          </div>
        </div>

        {/* Back Side */}
        <div className="card-face card-back" ref={cardBackRef}>
          <div className="back-bg" />
          <img src={backLogo} alt="" className="back-logo-img" />
          <h2 className="back-title-text">MediCare</h2>
          <p className="back-subtitle-text">رعاية طبية متكاملة</p>
          <img src={backWave} alt="" className="back-wave-img" />
        </div>
      </div>

      {/* Flip Button */}
      {!hideFlipButton && !staticSide && (
        <button 
          className="flip-btn"
          onClick={handleFlip}
        >
          <span>{isFlipped ? '↩️' : '🔄'}</span>
          {isFlipped ? ' العودة للوجه الأمامي' : ' عرض الخلف'}
        </button>
      )}
    </div>
  );
};

export default EmergencyCard3D;
