/* @ds-bundle: {"format":4,"namespace":"DownloadEverythingDesignSystem_620170","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"StepIndex","sourcePath":"components/feedback/StepIndex.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Segmented","sourcePath":"components/forms/Segmented.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"UrlInput","sourcePath":"components/forms/UrlInput.jsx"},{"name":"CompareSlider","sourcePath":"components/media/CompareSlider.jsx"},{"name":"DownloadItem","sourcePath":"components/media/DownloadItem.jsx"},{"name":"GlassPanel","sourcePath":"components/media/GlassPanel.jsx"},{"name":"MediaFrame","sourcePath":"components/media/MediaFrame.jsx"},{"name":"PixelImage","sourcePath":"components/media/PixelImage.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"30cdda58d44d","components/core/Button.jsx":"703e38716b08","components/core/Icon.jsx":"de8ad90600f2","components/core/IconButton.jsx":"3f46a705bff7","components/core/interact.js":"2cf2cb3f7633","components/feedback/Dialog.jsx":"5763b93558e8","components/feedback/ProgressBar.jsx":"52d31d40edbe","components/feedback/StepIndex.jsx":"3844ea9ba5c3","components/feedback/Toast.jsx":"5996cf292f8b","components/feedback/Tooltip.jsx":"8e8749cda5ac","components/forms/Checkbox.jsx":"123c1a7c82c2","components/forms/Segmented.jsx":"8811f3f9d360","components/forms/Select.jsx":"88d8b9a86a26","components/forms/Switch.jsx":"eec991f7db91","components/forms/UrlInput.jsx":"07748129c145","components/media/CompareSlider.jsx":"ee47665202d8","components/media/DownloadItem.jsx":"1c5fb15de565","components/media/GlassPanel.jsx":"52202802544e","components/media/MediaFrame.jsx":"bdb0456e6d96","components/media/PixelImage.jsx":"ebe5d333787c","ui_kits/desktop/AnalyzeScreen.jsx":"a42c9ed2f368","ui_kits/desktop/App.jsx":"e894ddac35b6","ui_kits/desktop/Chrome.jsx":"cbc1b50ac99f","ui_kits/desktop/HomeScreen.jsx":"aff95e4a6ee5","ui_kits/desktop/QueueScreen.jsx":"6b1748c0d8f4","ui_kits/desktop/SettingsScreen.jsx":"8ed267c91089","ui_kits/desktop/Splash.jsx":"e885560e3df0","ui_kits/desktop/UpscaleScreen.jsx":"5464f5ffa915","ui_kits/desktop/launch/LaunchAnimation.js":"e3c367b2d614","ui_kits/desktop/launch/animations-v3.js":"06ae64d470d6","ui_kits/desktop/launch/tweaks-panel.js":"d259e3a86f73"},"inlinedExternals":[],"unexposedExports":[{"name":"useInteract","sourcePath":"components/core/interact.js"}]} */

(() => {

const __ds_ns = (window.DownloadEverythingDesignSystem_620170 = window.DownloadEverythingDesignSystem_620170 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Icon({
  name,
  size = 18,
  color,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("i", _extends({
    className: 'icon-' + name,
    "aria-hidden": "true",
    style: {
      fontSize: size,
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
      color,
      flexShrink: 0,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function Badge({
  tone = 'neutral',
  icon,
  mono,
  children,
  style
}) {
  const t = {
    neutral: ['var(--surface-3)', 'var(--text-secondary)'],
    accent: ['var(--accent-soft)', 'var(--accent-text)'],
    success: ['var(--success-soft)', 'var(--success)'],
    warning: ['var(--warning-soft)', 'var(--warning)'],
    info: ['var(--info-soft)', 'var(--info)'],
    solid: ['var(--accent)', '#fff'],
    inverse: ['var(--text-primary)', 'var(--bg-app)']
  }[tone];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: 22,
      padding: '0 9px',
      borderRadius: 'var(--radius-xs)',
      background: t[0],
      color: t[1],
      font: mono ? 'var(--weight-medium) 11px/1 var(--font-mono)' : 'var(--weight-medium) 10px/1 var(--font-mono)',
      letterSpacing: mono ? 0 : 'var(--tracking-label)',
      textTransform: mono ? 'none' : 'uppercase',
      whiteSpace: 'nowrap',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 12
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/interact.js
try { (() => {
function useInteract() {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  return {
    hover,
    press,
    bind: {
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => {
        setHover(false);
        setPress(false);
      },
      onMouseDown: () => setPress(true),
      onMouseUp: () => setPress(false)
    }
  };
}
Object.assign(__ds_scope, { useInteract });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/interact.js", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    h: 'var(--control-sm)',
    px: 14,
    fs: '11px',
    ic: 14
  },
  md: {
    h: 'var(--control-md)',
    px: 20,
    fs: '12px',
    ic: 16
  },
  lg: {
    h: 'var(--control-lg)',
    px: 28,
    fs: '13px',
    ic: 18
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  disabled,
  fullWidth,
  children,
  style,
  ...rest
}) {
  const {
    hover,
    press,
    bind
  } = __ds_scope.useInteract();
  const s = SIZES[size] || SIZES.md;
  const v = {
    primary: {
      bg: hover ? 'var(--accent-hover)' : 'var(--accent)',
      fg: 'var(--text-on-accent)',
      bd: 'transparent',
      sh: hover ? 'var(--shadow-accent)' : 'var(--inset-top)'
    },
    secondary: {
      bg: hover ? 'var(--surface-3)' : 'var(--surface-2)',
      fg: 'var(--text-primary)',
      bd: 'var(--border-default)',
      sh: 'var(--inset-top)'
    },
    ghost: {
      bg: hover ? 'var(--surface-glass-light)' : 'transparent',
      fg: 'var(--text-primary)',
      bd: 'transparent',
      sh: 'none'
    },
    outline: {
      bg: 'transparent',
      fg: 'var(--text-primary)',
      bd: hover ? 'var(--text-primary)' : 'var(--border-strong)',
      sh: 'none'
    },
    light: {
      bg: hover ? 'var(--fog-1)' : 'var(--fog-0)',
      fg: 'var(--ink-0)',
      bd: 'transparent',
      sh: 'none'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled
  }, bind, rest, {
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: s.h,
      padding: '0 ' + s.px + 'px',
      borderRadius: 'var(--radius-control)',
      border: '1px solid ' + v.bd,
      background: v.bg,
      color: v.fg,
      boxShadow: v.sh,
      font: 'var(--weight-medium) ' + s.fs + '/1 var(--font-mono)',
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .4 : 1,
      transform: press && !disabled ? 'scale(var(--press-scale))' : 'none',
      transition: 'all var(--dur-base) var(--ease-out)',
      whiteSpace: 'nowrap',
      ...style
    }
  }), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.ic
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.ic
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  icon,
  variant = 'outline',
  size = 44,
  label,
  active,
  disabled,
  style,
  ...rest
}) {
  const {
    hover,
    press,
    bind
  } = __ds_scope.useInteract();
  const v = {
    outline: {
      bg: hover ? 'var(--surface-glass-light)' : 'transparent',
      fg: 'var(--text-primary)',
      bd: hover ? 'var(--text-primary)' : 'var(--border-strong)'
    },
    solid: {
      bg: hover ? 'var(--accent-hover)' : 'var(--accent)',
      fg: '#fff',
      bd: 'transparent'
    },
    glass: {
      bg: hover ? 'var(--surface-3)' : 'var(--surface-glass)',
      fg: 'var(--text-primary)',
      bd: 'var(--border-subtle)'
    },
    light: {
      bg: 'var(--fog-0)',
      fg: 'var(--ink-0)',
      bd: 'transparent'
    }
  }[variant];
  const act = active ? {
    bg: 'var(--text-primary)',
    fg: 'var(--bg-app)',
    bd: 'transparent'
  } : v;
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    title: label,
    disabled: disabled
  }, bind, rest, {
    style: {
      width: size,
      height: size,
      borderRadius: 'var(--radius-control)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: act.bg,
      color: act.fg,
      border: '1px solid ' + act.bd,
      backdropFilter: variant === 'glass' ? 'var(--blur-glass)' : undefined,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .4 : 1,
      transform: press ? 'scale(.94)' : 'none',
      transition: 'all var(--dur-base) var(--ease-out)',
      flexShrink: 0,
      padding: 0,
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * .4)
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  title,
  eyebrow,
  children,
  footer,
  onClose,
  width = 460,
  style
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(5,5,6,.6)',
      backdropFilter: 'blur(6px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    style: {
      width,
      maxWidth: 'calc(100% - 32px)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--surface-1)',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-3)',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
      padding: '24px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--accent-text)'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-bold) 26px/1.1 var(--font-display)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--text-primary)'
    }
  }, title)), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    size: 34,
    label: "Fermer",
    onClick: onClose
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 24px 24px',
      font: 'var(--type-body)',
      color: 'var(--text-secondary)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      padding: '16px 24px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-2)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
function ProgressBar({
  value = 0,
  tone = 'accent',
  height = 3,
  showValue,
  style
}) {
  const c = tone === 'success' ? 'var(--success)' : tone === 'neutral' ? 'var(--text-primary)' : 'var(--accent)';
  const p = Math.max(0, Math.min(100, value));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height,
      borderRadius: 999,
      background: 'var(--border-default)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: p + '%',
      height: '100%',
      background: c,
      borderRadius: 999,
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  })), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 11px/1 var(--font-mono)',
      color: 'var(--text-secondary)',
      minWidth: 34,
      textAlign: 'right'
    }
  }, Math.round(p), "%"));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StepIndex.jsx
try { (() => {
function StepIndex({
  current = 1,
  total = 3,
  style
}) {
  const pad = n => String(n).padStart(2, '0');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      font: 'var(--weight-medium) 12px/1 var(--font-mono)',
      color: 'var(--text-secondary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-primary)'
    }
  }, pad(current)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 140,
      height: 1,
      background: 'var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      top: -0.5,
      height: 2,
      width: current / total * 100 + '%',
      background: 'var(--text-primary)',
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  })), /*#__PURE__*/React.createElement("span", null, pad(total)));
}
Object.assign(__ds_scope, { StepIndex });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StepIndex.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  tone = 'neutral',
  title,
  message,
  action,
  onClose,
  style
}) {
  const ic = {
    neutral: ['info', 'var(--text-secondary)'],
    success: ['circle-check', 'var(--success)'],
    error: ['circle-alert', 'var(--danger)'],
    accent: ['sparkles', 'var(--accent)']
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      width: 360,
      padding: '14px 14px 14px 16px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-glass)',
      backdropFilter: 'var(--blur-glass)',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-3)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic[0],
    size: 18,
    color: ic[1],
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-bold) 14px/1.3 var(--font-sans)',
      color: 'var(--text-primary)'
    }
  }, title), message && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, message), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, action)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Fermer",
    style: {
      background: 'transparent',
      border: 0,
      color: 'var(--text-tertiary)',
      cursor: 'pointer',
      padding: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 16
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  label,
  children,
  placement = 'top',
  style
}) {
  const [show, setShow] = React.useState(false);
  const pos = placement === 'bottom' ? {
    top: 'calc(100% + 8px)'
  } : placement === 'right' ? {
    left: 'calc(100% + 10px)',
    top: '50%',
    transform: 'translateY(-50%)'
  } : {
    bottom: 'calc(100% + 8px)'
  };
  const center = placement === 'right' ? {} : {
    left: '50%',
    transform: 'translateX(-50%)'
  };
  return /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    }
  }, children, show && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      ...center,
      ...pos,
      zIndex: 60,
      padding: '6px 10px',
      borderRadius: 'var(--radius-xs)',
      background: 'var(--fog-1)',
      color: 'var(--ink-0)',
      font: 'var(--weight-semibold) 12px/1.2 var(--font-sans)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      boxShadow: 'var(--shadow-2)'
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .45 : 1,
      font: 'var(--weight-medium) 14px/1.3 var(--font-sans)',
      color: 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 2,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: checked ? 'var(--accent)' : 'transparent',
      border: '1.5px solid ' + (checked ? 'var(--accent)' : 'var(--border-strong)'),
      color: '#fff',
      transition: 'all var(--dur-fast) var(--ease-out)',
      flexShrink: 0
    }
  }, checked && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 13
  })), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Segmented.jsx
try { (() => {
function Segmented({
  options = [],
  value,
  onChange,
  size = 'md',
  style
}) {
  const h = size === 'sm' ? 30 : 38;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      padding: 3,
      gap: 2,
      borderRadius: 'var(--radius-control)',
      background: 'var(--surface-2)',
      border: '1px solid var(--border-subtle)',
      ...style
    }
  }, options.map(o => {
    const v = o.value ?? o;
    const l = o.label ?? o;
    const on = v === value;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      onClick: () => onChange && onChange(v),
      style: {
        height: h,
        padding: '0 16px',
        borderRadius: 'var(--radius-xs)',
        border: 0,
        cursor: 'pointer',
        background: on ? 'var(--text-primary)' : 'transparent',
        color: on ? 'var(--bg-app)' : 'var(--text-secondary)',
        font: 'var(--weight-bold) ' + (size === 'sm' ? '10px' : '11px') + '/1 var(--font-mono)',
        letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase',
        transition: 'all var(--dur-base) var(--ease-out)'
      }
    }, l);
  }));
}
Object.assign(__ds_scope, { Segmented });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Segmented.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  value,
  options = [],
  onChange,
  icon,
  style
}) {
  const [open, setOpen] = React.useState(false);
  const cur = options.find(o => (o.value ?? o) === value);
  const lab = cur ? cur.label ?? cur : '—';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-block',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(!open),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: 46,
      padding: '0 14px 0 16px',
      width: '100%',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-2)',
      border: '1px solid ' + (open ? 'var(--border-strong)' : 'var(--border-default)'),
      color: 'var(--text-primary)',
      cursor: 'pointer',
      textAlign: 'left'
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 15,
    color: "var(--text-tertiary)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      flex: 1,
      minWidth: 0
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 9px/1 var(--font-mono)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) 14px/1 var(--font-sans)'
    }
  }, lab)), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16,
    color: "var(--text-secondary)",
    style: {
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out)'
    }
  })), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 6px)',
      left: 0,
      right: 0,
      zIndex: 20,
      padding: 6,
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-glass)',
      backdropFilter: 'var(--blur-glass)',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-3)'
    }
  }, options.map(o => {
    const v = o.value ?? o;
    const l = o.label ?? o;
    const sel = v === value;
    return /*#__PURE__*/React.createElement("div", {
      key: v,
      onClick: () => {
        onChange && onChange(v);
        setOpen(false);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '9px 10px',
        borderRadius: 'var(--radius-xs)',
        cursor: 'pointer',
        font: 'var(--weight-medium) 13px/1 var(--font-sans)',
        color: sel ? 'var(--text-primary)' : 'var(--text-secondary)',
        background: sel ? 'var(--surface-glass-light)' : 'transparent'
      }
    }, l, sel && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "check",
      size: 14,
      color: "var(--accent)"
    }));
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      position: 'relative',
      width: 40,
      height: 24,
      borderRadius: 999,
      background: checked ? 'var(--accent)' : 'var(--surface-3)',
      border: '1px solid ' + (checked ? 'transparent' : 'var(--border-default)'),
      transition: 'background var(--dur-base) var(--ease-out)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? 18 : 2,
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: 'var(--shadow-1)',
      transition: 'left var(--dur-base) var(--ease-out)'
    }
  })), (label || description) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) 14px/1.3 var(--font-sans)',
      color: 'var(--text-primary)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-tertiary)'
    }
  }, description)));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/UrlInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function UrlInput({
  value,
  onChange,
  placeholder = 'Collez un lien…',
  icon = 'link',
  action,
  size = 'md',
  error,
  disabled,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const h = size === 'lg' ? 72 : size === 'sm' ? 36 : 46;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: h,
      padding: size === 'lg' ? '0 8px 0 22px' : '0 6px 0 16px',
      borderRadius: 'var(--radius-control)',
      background: 'var(--surface-2)',
      border: '1px solid ' + (error ? 'var(--danger)' : focus ? 'var(--border-strong)' : 'var(--border-default)'),
      boxShadow: focus ? '0 0 0 4px var(--focus-ring)' : 'var(--inset-top)',
      transition: 'all var(--dur-base) var(--ease-out)',
      opacity: disabled ? .5 : 1,
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'lg' ? 20 : 16,
    color: "var(--text-tertiary)"
  }), /*#__PURE__*/React.createElement("input", _extends({
    value: value,
    onChange: e => onChange && onChange(e.target.value),
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  }, rest, {
    style: {
      flex: 1,
      minWidth: 0,
      height: '100%',
      background: 'transparent',
      border: 0,
      outline: 0,
      color: 'var(--text-primary)',
      font: (size === 'lg' ? 'var(--weight-medium) 17px' : 'var(--weight-regular) 14px') + '/1 var(--font-mono)'
    }
  })), action);
}
Object.assign(__ds_scope, { UrlInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/UrlInput.jsx", error: String((e && e.message) || e) }); }

// components/media/GlassPanel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function GlassPanel({
  children,
  padding = 20,
  radius = 'var(--radius-lg)',
  tone = 'dark',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      padding,
      borderRadius: radius,
      background: tone === 'solid' ? 'var(--surface-1)' : 'var(--surface-glass)',
      backdropFilter: tone === 'solid' ? undefined : 'var(--blur-glass)',
      WebkitBackdropFilter: tone === 'solid' ? undefined : 'var(--blur-glass)',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-2), var(--inset-top)',
      ...style
    }
  }), children);
}
Object.assign(__ds_scope, { GlassPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/GlassPanel.jsx", error: String((e && e.message) || e) }); }

// components/media/PixelImage.jsx
try { (() => {
function rng(seed) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
function paintProcedural(c, w, h, seed) {
  const x = c.getContext('2d');
  const r = rng(seed);
  x.fillStyle = '#0B0B0C';
  x.fillRect(0, 0, w, h);
  const blob = (cx, cy, rad, col) => {
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, rad);
    g.addColorStop(0, col);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, w, h);
  };
  blob(w * (.55 + r() * .3), h * (.3 + r() * .4), Math.max(w, h) * (.35 + r() * .2), 'rgba(242,43,43,.95)');
  blob(w * (.1 + r() * .4), h * (.5 + r() * .4), Math.max(w, h) * (.3 + r() * .2), 'rgba(120,70,60,.55)');
  blob(w * (.3 + r() * .5), h * (.2 + r() * .3), Math.max(w, h) * .12, 'rgba(255,240,230,.85)');
  const hz = h * (.62 + r() * .15);
  const g = x.createLinearGradient(0, hz - h * .2, 0, h);
  g.addColorStop(0, 'rgba(5,5,5,0)');
  g.addColorStop(.35, 'rgba(5,5,5,.85)');
  g.addColorStop(1, '#050505');
  x.fillStyle = g;
  x.fillRect(0, 0, w, h);
}
function PixelImage({
  src,
  block = 1,
  animateFrom,
  duration = 1400,
  seed = 7,
  ratio = '16/9',
  grid = true,
  radius = 'var(--radius-md)',
  children,
  style
}) {
  const wrap = React.useRef(null);
  const cv = React.useRef(null);
  const srcCv = React.useRef(null);
  const [size, setSize] = React.useState([0, 0]);
  const [img, setImg] = React.useState(null);
  const [b, setB] = React.useState(animateFrom || block);
  React.useEffect(() => {
    const ro = new ResizeObserver(([e]) => setSize([Math.round(e.contentRect.width), Math.round(e.contentRect.height)]));
    ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);
  React.useEffect(() => {
    if (!src) {
      setImg(null);
      return;
    }
    const i = new Image();
    i.onload = () => setImg(i);
    i.src = src;
  }, [src]);
  React.useEffect(() => {
    if (!animateFrom || animateFrom <= block) {
      setB(block);
      return;
    }
    let raf;
    const st = performance.now();
    const tick = n => {
      const p = Math.min(1, (n - st) / duration);
      const e = 1 - Math.pow(1 - p, 2.2);
      setB(Math.max(block, Math.round(animateFrom * Math.pow(block / animateFrom, e))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animateFrom, block, duration]);
  React.useEffect(() => {
    const [w, h] = size;
    if (!w || !h) return;
    const s = document.createElement('canvas');
    s.width = w;
    s.height = h;
    if (img) {
      const x = s.getContext('2d');
      const k = Math.max(w / img.width, h / img.height);
      x.drawImage(img, (w - img.width * k) / 2, (h - img.height * k) / 2, img.width * k, img.height * k);
    } else paintProcedural(s, w, h, seed);
    srcCv.current = s;
    draw();
  }, [size, img, seed]);
  const draw = () => {
    const c = cv.current,
      s = srcCv.current;
    if (!c || !s) return;
    const [w, h] = size;
    const d = window.devicePixelRatio || 1;
    c.width = w * d;
    c.height = h * d;
    const x = c.getContext('2d');
    const bb = Math.max(1, b);
    if (bb <= 1) {
      x.imageSmoothingEnabled = true;
      x.drawImage(s, 0, 0, w * d, h * d);
      return;
    }
    const ow = Math.max(1, Math.ceil(w / bb)),
      oh = Math.max(1, Math.ceil(h / bb));
    const o = document.createElement('canvas');
    o.width = ow;
    o.height = oh;
    const ox = o.getContext('2d');
    ox.imageSmoothingEnabled = true;
    ox.drawImage(s, 0, 0, ow, oh);
    x.imageSmoothingEnabled = false;
    x.drawImage(o, 0, 0, ow * bb * d, oh * bb * d);
    if (grid && bb >= 6) {
      x.fillStyle = 'rgba(5,5,5,.6)';
      for (let i = 0; i < ow; i++) x.fillRect(i * bb * d, 0, Math.max(1, d), h * d);
      for (let j = 0; j < oh; j++) x.fillRect(0, j * bb * d, w * d, Math.max(1, d));
    }
  };
  React.useEffect(draw, [b]);
  return /*#__PURE__*/React.createElement("div", {
    ref: wrap,
    style: {
      position: 'relative',
      aspectRatio: ratio,
      borderRadius: radius,
      overflow: 'hidden',
      background: 'var(--ink-1)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: cv,
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      display: 'block'
    }
  }), children);
}
Object.assign(__ds_scope, { PixelImage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/PixelImage.jsx", error: String((e && e.message) || e) }); }

// components/media/CompareSlider.jsx
try { (() => {
function CompareSlider({
  src,
  beforeBlock = 14,
  afterBlock = 1,
  seed = 7,
  beforeLabel = 'Original',
  afterLabel = 'Upscale 4×',
  ratio = '16/9',
  initial = 50,
  style
}) {
  const [x, setX] = React.useState(initial);
  const ref = React.useRef(null);
  const drag = React.useRef(false);
  React.useEffect(() => {
    const mv = e => {
      if (!drag.current || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setX(Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100)));
    };
    const up = () => drag.current = false;
    window.addEventListener('mousemove', mv);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', mv);
      window.removeEventListener('mouseup', up);
    };
  }, []);
  const tag = {
    position: 'absolute',
    top: 14,
    padding: '6px 9px',
    borderRadius: 'var(--radius-xs)',
    font: 'var(--weight-medium) 10px/1 var(--font-mono)',
    letterSpacing: 'var(--tracking-label)',
    textTransform: 'uppercase'
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onMouseDown: e => {
      drag.current = true;
      const r = ref.current.getBoundingClientRect();
      setX(Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100)));
    },
    style: {
      position: 'relative',
      aspectRatio: ratio,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      cursor: 'ew-resize',
      userSelect: 'none',
      border: '1px solid var(--border-default)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PixelImage, {
    src: src,
    seed: seed,
    block: afterBlock,
    ratio: ratio,
    radius: "0",
    style: {
      position: 'absolute',
      inset: 0,
      aspectRatio: 'auto'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      clipPath: 'inset(0 ' + (100 - x) + '% 0 0)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PixelImage, {
    src: src,
    seed: seed,
    block: beforeBlock,
    ratio: ratio,
    radius: "0",
    style: {
      position: 'absolute',
      inset: 0,
      aspectRatio: 'auto'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      ...tag,
      left: 14,
      background: 'var(--surface-glass)',
      backdropFilter: 'var(--blur-glass)',
      color: 'var(--text-primary)'
    }
  }, beforeLabel), /*#__PURE__*/React.createElement("span", {
    style: {
      ...tag,
      right: 14,
      background: 'var(--accent)',
      color: '#fff'
    }
  }, afterLabel), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: x + '%',
      width: 1,
      background: '#fff',
      boxShadow: '0 0 18px rgba(255,255,255,.6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 36,
      height: 36,
      marginLeft: -18,
      marginTop: -18,
      borderRadius: 'var(--radius-control)',
      background: '#fff',
      color: 'var(--ink-0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-2)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevrons-left-right",
    size: 16
  }))));
}
Object.assign(__ds_scope, { CompareSlider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/CompareSlider.jsx", error: String((e && e.message) || e) }); }

// components/media/MediaFrame.jsx
try { (() => {
function MediaFrame({
  src,
  label,
  ratio = '16/9',
  radius = 'var(--radius-md)',
  kind = 'video',
  block = 1,
  seed,
  children,
  style
}) {
  const sd = seed ?? (label || kind).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return /*#__PURE__*/React.createElement(__ds_scope.PixelImage, {
    src: src,
    block: block,
    seed: sd,
    ratio: ratio,
    radius: radius,
    style: {
      border: '1px solid var(--border-subtle)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 8,
      bottom: 7,
      font: 'var(--weight-medium) 9px/1 var(--font-mono)',
      letterSpacing: '.08em',
      color: 'var(--text-secondary)',
      textTransform: 'uppercase'
    }
  }, label), children);
}
Object.assign(__ds_scope, { MediaFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/MediaFrame.jsx", error: String((e && e.message) || e) }); }

// components/media/DownloadItem.jsx
try { (() => {
function DownloadItem({
  title,
  source,
  kind = 'video',
  specs = [],
  status = 'downloading',
  progress = 0,
  speed,
  onAction,
  style
}) {
  const st = {
    queued: ['neutral', 'En attente'],
    downloading: ['accent', 'Téléchargement'],
    upscaling: ['info', 'Upscale'],
    done: ['success', 'Terminé'],
    error: ['warning', 'Échec']
  }[status];
  const act = status === 'done' ? 'folder-open' : status === 'error' ? 'rotate-cw' : 'pause';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: 12,
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.MediaFrame, {
    kind: kind,
    ratio: "16/10",
    radius: "var(--radius-sm)",
    style: {
      width: 112,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-bold) 15px/1.2 var(--font-sans)',
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, source && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      font: 'var(--weight-regular) 12px/1 var(--font-mono)',
      color: 'var(--text-tertiary)',
      marginRight: 4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "globe",
    size: 12
  }), source), specs.map(s => /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    key: s,
    mono: true
  }, s))), (status === 'downloading' || status === 'upscaling') && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ProgressBar, {
    value: progress,
    tone: status === 'upscaling' ? 'neutral' : 'accent',
    showValue: true,
    style: {
      flex: 1
    }
  }), speed && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) 11px/1 var(--font-mono)',
      color: 'var(--text-tertiary)'
    }
  }, speed))), /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: st[0]
  }, st[1]), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: act,
    size: 38,
    onClick: onAction,
    label: "Action"
  }));
}
Object.assign(__ds_scope, { DownloadItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/DownloadItem.jsx", error: String((e && e.message) || e) }); }

// ui_kits/desktop/AnalyzeScreen.jsx
try { (() => {
(() => {
  const {
    Button,
    Badge,
    PixelImage,
    Segmented,
    Checkbox,
    GlassPanel,
    Icon,
    IconButton
  } = window.DownloadEverythingDesignSystem_620170;
  const QUALITIES = {
    Vidéo: [['2160p', '4K · 60 fps', '1.24 GB'], ['1440p', 'QHD · 60 fps', '680 MB'], ['1080p', 'Full HD · 30 fps', '212 MB'], ['720p', 'HD · 30 fps', '96 MB']],
    Audio: [['320k', 'MP3 · 320 kbps', '9.8 MB'], ['flac', 'FLAC · sans perte', '41 MB']]
  };
  const LOG = ['Connexion à vimeo.com', 'Métadonnées reçues', '1 vidéo · 04:12', '6 formats disponibles', 'Qualité max : 2160p'];
  function AnalyzeScreen({
    url,
    onBack,
    onDownload
  }) {
    const [lines, setLines] = React.useState(0);
    const [ready, setReady] = React.useState(false);
    const [type, setType] = React.useState('Vidéo');
    const [q, setQ] = React.useState('2160p');
    const [up, setUp] = React.useState(false);
    const [subs, setSubs] = React.useState(true);
    React.useEffect(() => {
      const ts = LOG.map((_, i) => setTimeout(() => setLines(i + 1), 250 + i * 320));
      ts.push(setTimeout(() => setReady(true), 2100));
      return () => ts.forEach(clearTimeout);
    }, []);
    React.useEffect(() => {
      setQ(QUALITIES[type][0][0]);
    }, [type]);
    const list = QUALITIES[type];
    const sel = list.find(x => x[0] === q) || list[0];
    const lab = {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)'
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        padding: '32px 40px 32px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: 22
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: "arrow-left",
      size: 36,
      onClick: onBack,
      label: "Retour"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-mono)',
        color: 'var(--text-tertiary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, url)), /*#__PURE__*/React.createElement(PixelImage, {
      animateFrom: 56,
      block: 1,
      duration: 1900,
      seed: 21,
      radius: "var(--radius-lg)",
      style: {
        border: '1px solid var(--border-default)'
      }
    }, !ready && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 90,
        background: 'linear-gradient(180deg,rgba(242,43,43,0),rgba(242,43,43,.28))',
        borderBottom: '1px solid rgba(255,90,90,.9)',
        animation: 'kscan 1.1s linear infinite'
      }
    }), /*#__PURE__*/React.createElement(Ticks, {
      inset: 14
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 30,
        top: 28,
        display: 'flex',
        gap: 6
      }
    }, ready ? /*#__PURE__*/React.createElement(Badge, {
      tone: "inverse"
    }, "Pr\xEAt") : /*#__PURE__*/React.createElement(Badge, {
      tone: "solid"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        background: '#fff',
        animation: 'se7en-blink .7s steps(1) infinite'
      }
    }), "Analyse")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 30,
        bottom: 26,
        ...lab,
        color: 'var(--text-primary)'
      }
    }, ready ? '3840×2160 · 60 fps' : '—')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        opacity: ready ? 1 : .25,
        transition: 'opacity var(--dur-slow)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        ...lab
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "globe",
      size: 12
    }), "vimeo.com \xB7 Studio Nord \xB7 04:12"), /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        font: 'var(--weight-bold) 34px/1 var(--font-display)',
        letterSpacing: 'var(--tracking-heading)'
      }
    }, "Coucher de soleil \u2014 Lisbonne"))), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 392,
        flexShrink: 0,
        padding: '32px 32px 32px 0'
      }
    }, /*#__PURE__*/React.createElement(GlassPanel, {
      tone: "solid",
      padding: 22,
      style: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
        overflow: 'hidden'
      }
    }, !ready ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        font: 'var(--type-mono)',
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lab
    }, "Journal"), LOG.slice(0, lines).map((l, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        animation: 'se7en-rise .35s var(--ease-out) both'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-secondary)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--accent)'
      }
    }, "\u203A"), " ", l), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--success)'
      }
    }, "ok"))), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 14,
        background: 'var(--accent)',
        animation: 'se7en-blink .8s steps(1) infinite'
      }
    })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        animation: 'se7en-rise .5s var(--ease-out) both'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lab
    }, "Format"), /*#__PURE__*/React.createElement(Segmented, {
      size: "sm",
      options: ['Vidéo', 'Audio'],
      value: type,
      onChange: setType
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, list.map(([k, d, s], i) => {
      const on = k === q;
      return /*#__PURE__*/React.createElement("button", {
        key: k,
        onClick: () => setQ(k),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '12px 14px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid ' + (on ? 'var(--accent)' : 'var(--border-subtle)'),
          background: on ? 'var(--accent-soft)' : 'transparent',
          boxShadow: on ? 'inset 3px 0 0 var(--accent)' : 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          textAlign: 'left',
          animation: 'se7en-rise .5s var(--ease-out) both',
          animationDelay: 60 + i * 50 + 'ms',
          transition: 'background var(--dur-fast),border-color var(--dur-fast)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--weight-bold) 17px/1 var(--font-display)'
        }
      }, k), /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--type-body-sm)',
          color: 'var(--text-tertiary)'
        }
      }, d)), /*#__PURE__*/React.createElement(Badge, {
        mono: true
      }, s));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: 'var(--border-subtle)'
      }
    }), /*#__PURE__*/React.createElement(Checkbox, {
      checked: up,
      onChange: setUp,
      label: /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8
        }
      }, "Upscaler ensuite ", /*#__PURE__*/React.createElement(Badge, {
        tone: "accent"
      }, "4\xD7"))
    }), type === 'Vidéo' && /*#__PURE__*/React.createElement(Checkbox, {
      checked: subs,
      onChange: setSubs,
      label: "Inclure les sous-titres"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      icon: "download",
      fullWidth: true,
      onClick: () => onDownload({
        title: 'Coucher de soleil — Lisbonne',
        source: 'vimeo.com',
        kind: type === 'Audio' ? 'audio' : 'video',
        specs: [type === 'Audio' ? 'MP3' : 'MP4', sel[0], sel[2]],
        upscale: up
      })
    }, "T\xE9l\xE9charger \xB7 ", sel[2])))));
  }
  window.AnalyzeScreen = AnalyzeScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/desktop/AnalyzeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/desktop/App.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
(() => {
  const {
    Toast
  } = window.DownloadEverythingDesignSystem_620170;
  const SEED = [{
    id: 1,
    title: 'Interview complète — Épisode 12',
    source: 'youtube.com',
    kind: 'audio',
    specs: ['MP3', '320 kbps', '9.8 MB'],
    status: 'done',
    progress: 100
  }, {
    id: 2,
    title: 'portrait_studio_01',
    source: 'instagram.com',
    kind: 'photo',
    specs: ['PNG', '4×'],
    status: 'upscaling',
    progress: 58
  }, {
    id: 3,
    title: 'Timelapse Alpes — source 8K',
    source: 'vimeo.com',
    kind: 'video',
    specs: ['MP4', '2160p', '1.24 GB'],
    status: 'downloading',
    progress: 31,
    speed: '22.6 MB/s'
  }, {
    id: 4,
    title: 'Galerie — Architecture brutaliste (24)',
    source: 'pinterest.com',
    kind: 'photo',
    specs: ['JPG', '24 fichiers'],
    status: 'queued',
    progress: 0
  }];
  function useFit(w, h) {
    const [s, setS] = React.useState(1);
    React.useEffect(() => {
      const f = () => setS(Math.min(1, (window.innerWidth - 32) / w, (window.innerHeight - 32) / h));
      f();
      window.addEventListener('resize', f);
      return () => window.removeEventListener('resize', f);
    }, []);
    return s;
  }
  function App() {
    const scale = useFit(1280, 800);
    const [splash, setSplash] = React.useState(true);
    const [screen, setScreen] = React.useState(() => localStorage.getItem('se7en-screen') || 'home');
    const [url, setUrl] = React.useState('');
    const [items, setItems] = React.useState(SEED);
    const [toast, setToast] = React.useState(null);
    React.useEffect(() => {
      localStorage.setItem('se7en-screen', screen === 'analyze' ? 'home' : screen);
    }, [screen]);
    React.useEffect(() => {
      const t = setInterval(() => setItems(list => list.map(i => {
        if (i.status === 'downloading' || i.status === 'upscaling') {
          const p = Math.min(100, i.progress + Math.random() * 3.5);
          if (p >= 100) {
            if (i.upscale && i.status === 'downloading') return {
              ...i,
              status: 'upscaling',
              progress: 0,
              upscale: false,
              speed: undefined
            };
            return {
              ...i,
              progress: 100,
              status: 'done',
              speed: undefined
            };
          }
          return {
            ...i,
            progress: p
          };
        }
        return i;
      })), 400);
      return () => clearInterval(t);
    }, []);
    React.useEffect(() => {
      if (!toast) return;
      const t = setTimeout(() => setToast(null), 3200);
      return () => clearTimeout(t);
    }, [toast]);
    const add = job => {
      setItems(l => [{
        id: Date.now(),
        status: 'downloading',
        progress: 0,
        speed: '18.2 MB/s',
        ...job
      }, ...l]);
      setScreen('queue');
      setToast({
        tone: 'neutral',
        title: 'Ajouté à la file',
        message: job.title
      });
    };
    let body;
    if (screen === 'home') body = /*#__PURE__*/React.createElement(HomeScreen, {
      onAnalyze: u => {
        setUrl(u);
        setScreen('analyze');
      }
    });
    if (screen === 'analyze') body = /*#__PURE__*/React.createElement(AnalyzeScreen, {
      url: url,
      onBack: () => setScreen('home'),
      onDownload: add
    });
    if (screen === 'queue') body = /*#__PURE__*/React.createElement(QueueScreen, {
      items: items,
      onClear: () => setItems(l => l.filter(i => i.status !== 'done'))
    });
    if (screen === 'upscale') body = /*#__PURE__*/React.createElement(UpscaleScreen, {
      onDone: n => setToast({
        tone: 'accent',
        title: 'Upscale terminé',
        message: n
      })
    });
    if (screen === 'settings') body = /*#__PURE__*/React.createElement(SettingsScreen, null);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1280 * scale,
        height: 800 * scale
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1280,
        height: 800,
        transform: 'scale(' + scale + ')',
        transformOrigin: '0 0',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 12,
        overflow: 'hidden',
        background: 'var(--bg-app)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-3)'
      }
    }, /*#__PURE__*/React.createElement(TopBar, {
      screen: screen,
      onNav: setScreen,
      onLogo: () => setSplash(true),
      queueCount: items.filter(i => i.status !== 'done').length
    }), /*#__PURE__*/React.createElement("main", {
      key: screen,
      style: {
        flex: 1,
        position: 'relative',
        minHeight: 0,
        background: 'radial-gradient(90% 70% at 85% 0%,#140B0B,var(--ink-0) 55%)'
      }
    }, body, toast && /*#__PURE__*/React.createElement(Toast, _extends({}, toast, {
      onClose: () => setToast(null),
      style: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        zIndex: 40,
        animation: 'se7en-rise .4s var(--ease-out) both'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'var(--scanlines)',
        pointerEvents: 'none',
        zIndex: 90
      }
    }), splash && /*#__PURE__*/React.createElement(Splash, {
      onDone: () => setSplash(false)
    })));
  }
  window.App = App;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/desktop/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/desktop/Chrome.jsx
try { (() => {
(() => {
  const {
    IconButton,
    Icon
  } = window.DownloadEverythingDesignSystem_620170;
  function Wordmark({
    size = 24,
    onClick
  }) {
    return /*#__PURE__*/React.createElement("span", {
      onClick: onClick,
      style: {
        font: 'var(--weight-black) ' + size + 'px/1 var(--font-display)',
        letterSpacing: '-.05em',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none'
      }
    }, "se", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--accent)'
      }
    }, "7"), "en");
  }
  function TopBar({
    screen,
    onNav,
    queueCount,
    onLogo
  }) {
    const tabs = [['home', '01', 'Télécharger'], ['queue', '02', 'File'], ['upscale', '03', 'Upscale']];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: 'var(--topbar-h)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        padding: '0 24px 0 28px',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
        zIndex: 5,
        background: 'rgba(5,5,5,.7)',
        backdropFilter: 'var(--blur-glass)'
      }
    }, /*#__PURE__*/React.createElement(Wordmark, {
      size: 26,
      onClick: onLogo
    }), /*#__PURE__*/React.createElement("nav", {
      style: {
        display: 'flex',
        gap: 2,
        marginLeft: 20,
        height: '100%'
      }
    }, tabs.map(([k, n, l]) => {
      const on = screen === k || k === 'home' && screen === 'analyze';
      return /*#__PURE__*/React.createElement("button", {
        key: k,
        onClick: () => onNav(k),
        style: {
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          padding: '0 16px',
          background: 'transparent',
          border: 0,
          cursor: 'pointer',
          color: on ? 'var(--text-primary)' : 'var(--text-tertiary)',
          font: 'var(--weight-medium) 13px/1 var(--font-sans)',
          transition: 'color var(--dur-fast)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--weight-medium) 10px/1 var(--font-mono)',
          color: on ? 'var(--accent)' : 'var(--text-disabled)'
        }
      }, n), l, k === 'queue' && queueCount > 0 && /*#__PURE__*/React.createElement("span", {
        style: {
          minWidth: 18,
          height: 18,
          padding: '0 5px',
          borderRadius: 2,
          background: 'var(--accent)',
          color: '#fff',
          font: '500 10px/18px var(--font-mono)',
          textAlign: 'center'
        }
      }, queueCount), /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: -1,
          height: 2,
          background: 'var(--accent)',
          boxShadow: 'var(--glow-accent)',
          transform: on ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform var(--dur-base) var(--ease-out)'
        }
      }));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        font: 'var(--type-label)',
        letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase',
        color: 'var(--text-tertiary)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        background: 'var(--success)',
        boxShadow: '0 0 10px var(--success)'
      }
    }), "GPU pr\xEAt"), /*#__PURE__*/React.createElement(IconButton, {
      icon: "settings",
      size: 36,
      active: screen === 'settings',
      onClick: () => onNav('settings'),
      label: "R\xE9glages"
    }));
  }
  function PageHead({
    eyebrow,
    title,
    right
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 24,
        marginBottom: 28,
        animation: 'se7en-rise .6s var(--ease-out) both'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, eyebrow && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-label)',
        letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase',
        color: 'var(--accent-text)'
      }
    }, eyebrow), /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        font: 'var(--weight-black) 60px/.9 var(--font-display)',
        letterSpacing: 'var(--tracking-display)'
      }
    }, title)), right);
  }
  function Ticks({
    inset = 0,
    size = 14,
    color = 'var(--border-strong)'
  }) {
    const b = '1px solid ' + color;
    const s = {
      position: 'absolute',
      width: size,
      height: size,
      pointerEvents: 'none'
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        ...s,
        left: inset,
        top: inset,
        borderLeft: b,
        borderTop: b
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        ...s,
        right: inset,
        top: inset,
        borderRight: b,
        borderTop: b
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        ...s,
        right: inset,
        bottom: inset,
        borderRight: b,
        borderBottom: b
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        ...s,
        left: inset,
        bottom: inset,
        borderLeft: b,
        borderBottom: b
      }
    }));
  }
  function PixelField() {
    const cv = React.useRef(null);
    React.useEffect(() => {
      const c = cv.current;
      const x = c.getContext('2d');
      const d = window.devicePixelRatio || 1;
      let W = 0,
        H = 0;
      const rs = () => {
        W = c.clientWidth;
        H = c.clientHeight;
        c.width = W * d;
        c.height = H * d;
      };
      rs();
      const ro = new ResizeObserver(rs);
      ro.observe(c);
      let mx = -999,
        my = -999,
        tx = -999,
        ty = -999;
      const mv = e => {
        const r = c.getBoundingClientRect();
        const k = r.width / W || 1;
        tx = (e.clientX - r.left) / k;
        ty = (e.clientY - r.top) / k;
      };
      window.addEventListener('mousemove', mv);
      let raf;
      const G = 16;
      const tick = n => {
        mx += (tx - mx) * .1;
        my += (ty - my) * .1;
        x.setTransform(d, 0, 0, d, 0, 0);
        x.clearRect(0, 0, W, H);
        for (let yy = G / 2; yy < H; yy += G) for (let xx = G / 2; xx < W; xx += G) {
          const k = Math.max(0, 1 - Math.hypot(xx - mx, yy - my) / 230);
          const w = .5 + .5 * Math.sin(n / 1100 + xx * .011 + yy * .017);
          const a = .035 + w * .045 + k * k * .8;
          const s = 2 + k * k * 6;
          x.fillStyle = k > .55 ? 'rgba(242,43,43,' + a + ')' : 'rgba(244,243,241,' + a + ')';
          x.fillRect(xx - s / 2, yy - s / 2, s, s);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener('mousemove', mv);
      };
    }, []);
    return /*#__PURE__*/React.createElement("canvas", {
      ref: cv,
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%'
      }
    });
  }
  Object.assign(window, {
    Wordmark,
    TopBar,
    PageHead,
    Ticks,
    PixelField
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/desktop/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/desktop/HomeScreen.jsx
try { (() => {
(() => {
  const {
    UrlInput,
    Button
  } = window.DownloadEverythingDesignSystem_620170;
  const SOURCES = ['youtube.com', 'vimeo.com', 'instagram.com', 'tiktok.com', 'x.com', 'pinterest.com', 'reddit.com', 'soundcloud.com', 'dailymotion.com', 'twitch.tv', 'flickr.com', 'behance.net'];
  function Kbd({
    children
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 22,
        height: 22,
        padding: '0 6px',
        borderRadius: 3,
        border: '1px solid var(--border-default)',
        background: 'var(--surface-2)',
        font: 'var(--weight-medium) 11px/1 var(--font-mono)',
        color: 'var(--text-secondary)'
      }
    }, children);
  }
  function HomeScreen({
    onAnalyze
  }) {
    const [url, setUrl] = React.useState('');
    const go = () => onAnalyze(url || 'https://vimeo.com/824117301');
    const rise = i => ({
      animation: 'se7en-rise .8s var(--ease-out) both',
      animationDelay: i * 90 + 'ms'
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: '100%',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement(PixelField, null), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(70% 80% at 30% 45%,rgba(5,5,5,.92) 20%,rgba(5,5,5,.2) 80%)',
        pointerEvents: 'none'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '72px 64px 0'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...rise(0),
        font: 'var(--type-label)',
        letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase',
        color: 'var(--accent-text)'
      }
    }, "01 \u2014 Coller un lien"), /*#__PURE__*/React.createElement("h1", {
      style: {
        ...rise(1),
        margin: '22px 0 0',
        font: 'var(--weight-black) 108px/.9 var(--font-display)',
        letterSpacing: 'var(--tracking-display)'
      }
    }, "Un lien.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-disabled)'
      }
    }, "Tout le reste.")), /*#__PURE__*/React.createElement("p", {
      style: {
        ...rise(2),
        margin: '28px 0 0',
        maxWidth: 460,
        font: 'var(--type-body)',
        color: 'var(--text-secondary)'
      }
    }, "Vid\xE9os, photos, audio, galeries enti\xE8res. Choisissez la qualit\xE9, puis montez-la jusqu'en 4K."), /*#__PURE__*/React.createElement("div", {
      style: {
        ...rise(3),
        marginTop: 32,
        maxWidth: 780
      }
    }, /*#__PURE__*/React.createElement(UrlInput, {
      size: "lg",
      value: url,
      onChange: setUrl,
      onKeyDown: e => e.key === 'Enter' && go(),
      placeholder: "https://",
      action: /*#__PURE__*/React.createElement(Button, {
        size: "lg",
        icon: "scan-line",
        onClick: go
      }, "Analyser")
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        ...rise(4),
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        marginTop: 16,
        font: 'var(--type-body-sm)',
        color: 'var(--text-tertiary)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Kbd, null, "\u2318"), /*#__PURE__*/React.createElement(Kbd, null, "V"), " coller"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Kbd, null, "\u21B5"), " analyser")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        margin: '0 -64px',
        height: 52,
        borderTop: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        maskImage: 'linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)',
        WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 44,
        whiteSpace: 'nowrap',
        animation: 'se7en-marquee 40s linear infinite',
        font: 'var(--type-label)',
        letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase',
        color: 'var(--text-tertiary)'
      }
    }, [...SOURCES, ...SOURCES].map((s, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 44
      }
    }, s, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 4,
        height: 4,
        background: i % 3 === 0 ? 'var(--accent)' : 'var(--text-disabled)'
      }
    })))))));
  }
  window.HomeScreen = HomeScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/desktop/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/desktop/QueueScreen.jsx
try { (() => {
(() => {
  const {
    DownloadItem,
    Segmented,
    Button
  } = window.DownloadEverythingDesignSystem_620170;
  function QueueScreen({
    items,
    onClear
  }) {
    const [f, setF] = React.useState('Tout');
    const shown = items.filter(i => f === 'Tout' || (f === 'En cours' ? i.status !== 'done' : i.status === 'done'));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '48px 48px 32px',
        height: '100%',
        overflow: 'auto'
      }
    }, /*#__PURE__*/React.createElement(PageHead, {
      eyebrow: '02 — ' + items.filter(i => i.status !== 'done').length + ' en cours',
      title: "File d'attente",
      right: /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 12,
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement(Segmented, {
        options: ['Tout', 'En cours', 'Terminés'],
        value: f,
        onChange: setF
      }), /*#__PURE__*/React.createElement(Button, {
        variant: "outline",
        icon: "trash-2",
        onClick: onClear
      }, "Vider"))
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, shown.map((i, n) => /*#__PURE__*/React.createElement("div", {
      key: i.id,
      style: {
        animation: 'se7en-rise .5s var(--ease-out) both',
        animationDelay: n * 60 + 'ms'
      }
    }, /*#__PURE__*/React.createElement(DownloadItem, i)))), shown.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 60,
        textAlign: 'center',
        font: 'var(--type-body)',
        color: 'var(--text-tertiary)'
      }
    }, "Rien ici pour l'instant."));
  }
  window.QueueScreen = QueueScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/desktop/QueueScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/desktop/SettingsScreen.jsx
try { (() => {
(() => {
  const {
    Switch,
    Select,
    Button,
    GlassPanel
  } = window.DownloadEverythingDesignSystem_620170;
  function SettingsScreen() {
    const [s, setS] = React.useState({
      auto: false,
      notif: true,
      meta: true,
      gpu: true
    });
    const [dir, setDir] = React.useState('dl');
    const [q, setQ] = React.useState('best');
    const tog = k => v => setS({
      ...s,
      [k]: v
    });
    const Row = ({
      children
    }) => /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 0',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, children);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '48px 48px 32px',
        height: '100%',
        overflow: 'auto'
      }
    }, /*#__PURE__*/React.createElement(PageHead, {
      eyebrow: "04 \u2014 Pr\xE9f\xE9rences",
      title: "R\xE9glages"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        maxWidth: 980
      }
    }, /*#__PURE__*/React.createElement(GlassPanel, {
      tone: "solid",
      padding: "6px 22px"
    }, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Select, {
      label: "Dossier de destination",
      icon: "folder",
      value: dir,
      onChange: setDir,
      options: [{
        value: 'dl',
        label: '~/Téléchargements'
      }, {
        value: 'mov',
        label: '~/Vidéos'
      }, {
        value: 'ask',
        label: 'Demander à chaque fois'
      }],
      style: {
        width: '100%'
      }
    })), /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Select, {
      label: "Qualit\xE9 par d\xE9faut",
      icon: "gauge",
      value: q,
      onChange: setQ,
      options: [{
        value: 'best',
        label: 'Meilleure disponible'
      }, {
        value: '1080',
        label: '1080p'
      }, {
        value: '720',
        label: '720p'
      }],
      style: {
        width: '100%'
      }
    })), /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Switch, {
      checked: s.meta,
      onChange: tog('meta'),
      label: "Conserver les m\xE9tadonn\xE9es",
      description: "Titre, auteur, date de publication"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 0'
      }
    }, /*#__PURE__*/React.createElement(Switch, {
      checked: s.notif,
      onChange: tog('notif'),
      label: "Notifications",
      description: "\xC0 la fin de chaque t\xE2che"
    }))), /*#__PURE__*/React.createElement(GlassPanel, {
      tone: "solid",
      padding: "6px 22px"
    }, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Switch, {
      checked: s.auto,
      onChange: tog('auto'),
      label: "Upscale automatique",
      description: "Am\xE9liorer chaque fichier apr\xE8s t\xE9l\xE9chargement"
    })), /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Switch, {
      checked: s.gpu,
      onChange: tog('gpu'),
      label: "Acc\xE9l\xE9ration GPU",
      description: "Plus rapide, consomme plus d'\xE9nergie"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 0',
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      icon: "rotate-ccw"
    }, "R\xE9initialiser"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      icon: "external-link"
    }, "Journal")))));
  }
  window.SettingsScreen = SettingsScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/desktop/SettingsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/desktop/Splash.jsx
try { (() => {
(() => {
  const STEPS = [56, 40, 28, 18, 12, 7, 4, 2, 1];
  const RES = ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p', '4K'];
  const T0 = 520,
    STEP = 190,
    CRISP = T0 + STEPS.length * STEP,
    EXIT = 3700,
    END = 4500;
  const TAG = 'DOWNLOAD EVERYTHING — UPSCALE ANYTHING';
  const RED = [242, 43, 43],
    FOG = [244, 243, 241];
  const mix = (a, b, k) => 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',') + ')';
  function drawParts(x, fs, w, h, cSe, c7) {
    x.font = '800 ' + fs + 'px Syne';
    x.textBaseline = 'alphabetic';
    const parts = [['se', cSe], ['7', c7], ['en', cSe]];
    const tr = -fs * .05;
    const ws = parts.map(p => x.measureText(p[0]).width);
    const tot = ws.reduce((a, b) => a + b, 0) + tr * 2;
    let cx = (w - tot) / 2;
    const by = h / 2 + fs * .34;
    parts.forEach((p, i) => {
      x.fillStyle = p[1];
      x.fillText(p[0], cx, by);
      cx += ws[i] + tr;
    });
  }
  function renderWord(si, W, H, d) {
    const b = STEPS[si];
    const k = si / (STEPS.length - 1);
    const fs = Math.round(H * .3);
    const c = document.createElement('canvas');
    c.width = W * d;
    c.height = H * d;
    const x = c.getContext('2d');
    if (b === 1) {
      x.scale(d, d);
      drawParts(x, fs, W, H, mix(RED, FOG, 1), 'rgb(242,43,43)');
      return c;
    }
    const lw = Math.ceil(W / b),
      lh = Math.ceil(H / b);
    const o = document.createElement('canvas');
    o.width = lw;
    o.height = lh;
    const ox = o.getContext('2d');
    drawParts(ox, fs / b, lw, lh, '#ffffff', '#ff0000');
    const px = ox.getImageData(0, 0, lw, lh).data;
    const g = b >= 4 ? Math.max(1, Math.round(b * .14)) : 0;
    const se = mix(RED, FOG, Math.pow(k, 1.4));
    for (let yy = 0; yy < lh; yy++) for (let xx = 0; xx < lw; xx++) {
      const i = (yy * lw + xx) * 4;
      if (px[i + 3] < 90) continue;
      x.fillStyle = px[i + 1] < 130 && px[i] > 150 ? 'rgb(242,43,43)' : se;
      x.fillRect(xx * b * d, yy * b * d, (b - g) * d, (b - g) * d);
    }
    return c;
  }
  function Splash({
    onDone,
    loop
  }) {
    const wrapRef = React.useRef(null);
    const cv = React.useRef(null);
    const [t, setT] = React.useState(0);
    const done = React.useRef(false);
    const finish = () => {
      if (done.current || loop) return;
      done.current = true;
      onDone && onDone();
    };
    React.useEffect(() => {
      let raf,
        st,
        alive = true;
      const cache = {};
      const draw = e => {
        const c = cv.current;
        if (!c) return;
        const W = wrapRef.current.clientWidth,
          H = wrapRef.current.clientHeight,
          d = window.devicePixelRatio || 1;
        if (c.width !== W * d || c.height !== H * d) {
          c.width = W * d;
          c.height = H * d;
          for (const k in cache) delete cache[k];
        }
        const x = c.getContext('2d');
        x.setTransform(1, 0, 0, 1, 0, 0);
        x.clearRect(0, 0, c.width, c.height);
        if (e < T0) {
          if (Math.floor(e / 150) % 2 === 0) {
            x.fillStyle = 'rgb(242,43,43)';
            x.shadowColor = 'rgba(242,43,43,.8)';
            x.shadowBlur = 30 * d;
            x.fillRect((W / 2 - 9) * d, (H / 2 - 9) * d, 18 * d, 18 * d);
            x.shadowBlur = 0;
          }
          return;
        }
        const si = Math.min(STEPS.length - 1, Math.floor((e - T0) / STEP));
        const img = cache[si] || (cache[si] = renderWord(si, W, H, d));
        const xp = e > EXIT ? Math.min(1, (e - EXIT) / (END - EXIT)) : 0;
        const sc = 1 + .07 * xp * xp;
        x.globalAlpha = 1 - xp;
        x.setTransform(sc, 0, 0, sc, c.width * (1 - sc) / 2, c.height * (1 - sc) / 2);
        x.drawImage(img, 0, 0);
        if (e >= CRISP && e < CRISP + 900) {
          const p = (e - CRISP) / 900;
          const bx = (-.2 + p * 1.4) * W * d;
          const gr = x.createLinearGradient(bx - 120 * d, 0, bx + 120 * d, 0);
          gr.addColorStop(0, 'rgba(255,255,255,0)');
          gr.addColorStop(.5, 'rgba(255,255,255,.95)');
          gr.addColorStop(1, 'rgba(255,255,255,0)');
          x.globalCompositeOperation = 'source-atop';
          x.fillStyle = gr;
          x.fillRect(0, 0, c.width, c.height);
          x.globalCompositeOperation = 'source-over';
        }
        x.setTransform(1, 0, 0, 1, 0, 0);
        x.globalAlpha = 1;
        if (e < CRISP) {
          const y = (e - T0) / (STEP * 3) % 1 * H * d;
          const gr = x.createLinearGradient(0, y - 60 * d, 0, y);
          gr.addColorStop(0, 'rgba(242,43,43,0)');
          gr.addColorStop(1, 'rgba(242,43,43,.22)');
          x.fillStyle = gr;
          x.fillRect(0, y - 60 * d, c.width, 60 * d);
          x.fillStyle = 'rgba(255,90,90,.9)';
          x.fillRect(0, y, c.width, 1.5 * d);
        }
      };
      Promise.race([document.fonts.load('800 200px Syne'), new Promise(r => setTimeout(r, 900))]).then(() => {
        if (!alive) return;
        window.__splashAt = e => {
          alive = false;
          setT(e);
          draw(e);
        };
        st = performance.now();
        const tick = n => {
          if (!alive) return;
          let e = n - st;
          if (e >= END) {
            if (loop) {
              st = n;
              e = 0;
            } else {
              finish();
              return;
            }
          }
          setT(e);
          draw(e);
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        window.__splashTick = () => tick(performance.now());
      });
      return () => {
        alive = false;
        cancelAnimationFrame(raf);
      };
    }, []);
    const si = t < T0 ? -1 : Math.min(STEPS.length - 1, Math.floor((t - T0) / STEP));
    const xp = t > EXIT ? Math.min(1, (t - EXIT) / (END - EXIT)) : 0;
    const hud = t > T0 ? 1 - xp : 0;
    const typed = t > CRISP + 120 ? TAG.slice(0, Math.floor((t - CRISP - 120) / 26)) : '';
    const mono = {
      font: 'var(--weight-medium) 10px/1 var(--font-mono)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)'
    };
    const corner = (pos, rot) => /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        width: 16,
        height: 16,
        borderTop: '1px solid var(--border-strong)',
        borderLeft: '1px solid var(--border-strong)',
        transform: 'rotate(' + rot + 'deg)',
        ...pos
      }
    });
    return /*#__PURE__*/React.createElement("div", {
      ref: wrapRef,
      onClick: finish,
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        background: 'var(--ink-0)',
        cursor: loop ? 'default' : 'pointer',
        overflow: 'hidden',
        opacity: loop ? 1 : 1 - Math.max(0, (t - END + 260) / 260)
      }
    }, /*#__PURE__*/React.createElement("canvas", {
      ref: cv,
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'var(--scanlines)',
        pointerEvents: 'none'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(80% 70% at 50% 50%,transparent 40%,rgba(0,0,0,.7))',
        pointerEvents: 'none'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 28,
        opacity: hud,
        transition: 'opacity .3s',
        pointerEvents: 'none'
      }
    }, corner({
      left: 0,
      top: 0
    }, 0), corner({
      right: 0,
      top: 0
    }, 90), corner({
      right: 0,
      bottom: 0
    }, 180), corner({
      left: 0,
      bottom: 0
    }, 270), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 28,
        top: 26,
        display: 'flex',
        gap: 18,
        ...mono
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-primary)'
      }
    }, "se7en"), /*#__PURE__*/React.createElement("span", null, "v1.0"), /*#__PURE__*/React.createElement("span", null, "init")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 28,
        top: 26,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        ...mono
      }
    }, /*#__PURE__*/React.createElement("span", null, "R\xE9solution"), /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 52,
        textAlign: 'right',
        color: si === STEPS.length - 1 ? 'var(--accent)' : 'var(--text-primary)',
        fontSize: 12
      }
    }, si >= 0 ? RES[si] : '')), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: 'calc(50% + 24%)',
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
        ...mono,
        fontSize: 12,
        letterSpacing: '.32em',
        color: 'var(--text-secondary)'
      }
    }, typed, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-block',
        width: 8,
        height: 12,
        marginLeft: 4,
        verticalAlign: -1,
        background: 'var(--accent)',
        animation: 'se7en-blink .9s steps(1) infinite',
        opacity: typed && typed.length < TAG.length ? 1 : 0
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 28,
        right: 220,
        bottom: 30,
        height: 1,
        background: 'var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        width: Math.min(100, t / EXIT * 100) + '%',
        background: 'var(--text-primary)'
      }
    })), !loop && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 28,
        bottom: 26,
        ...mono
      }
    }, "Cliquer pour passer")));
  }
  window.Splash = Splash;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/desktop/Splash.jsx", error: String((e && e.message) || e) }); }

// ui_kits/desktop/UpscaleScreen.jsx
try { (() => {
(() => {
  const {
    CompareSlider,
    Segmented,
    Select,
    Button,
    Dialog,
    ProgressBar,
    GlassPanel
  } = window.DownloadEverythingDesignSystem_620170;
  const BLOCK = {
    '2×': 6,
    '4×': 12,
    '8×': 20
  };
  function UpscaleScreen({
    onDone
  }) {
    const [factor, setFactor] = React.useState('4×');
    const [model, setModel] = React.useState('photo');
    const [confirm, setConfirm] = React.useState(false);
    const [p, setP] = React.useState(null);
    const [src, setSrc] = React.useState(null);
    const [name, setName] = React.useState('lisbonne_still.png');
    const [dim, setDim] = React.useState([960, 540]);
    const [over, setOver] = React.useState(false);
    const file = React.useRef(null);
    React.useEffect(() => {
      if (p === null || p >= 100) return;
      const t = setTimeout(() => setP(x => Math.min(100, x + 2.5)), 60);
      return () => clearTimeout(t);
    }, [p]);
    React.useEffect(() => {
      if (p === 100) onDone(name);
    }, [p]);
    const load = f => {
      if (!f || !f.type.startsWith('image/')) return;
      const u = URL.createObjectURL(f);
      const i = new Image();
      i.onload = () => setDim([i.naturalWidth, i.naturalHeight]);
      i.src = u;
      setSrc(u);
      setName(f.name);
      setP(null);
    };
    const k = parseInt(factor);
    const bb = BLOCK[factor];
    const after = p === null || p >= 100 ? 1 : Math.max(1, Math.round(bb * (1 - p / 100)));
    const lab = {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)'
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '48px 48px 32px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement(PageHead, {
      eyebrow: "03 \u2014 Am\xE9lioration IA",
      title: "Upscale",
      right: /*#__PURE__*/React.createElement(Segmented, {
        options: ['2×', '4×', '8×'],
        value: factor,
        onChange: v => {
          setFactor(v);
          setP(null);
        }
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 20,
        flex: 1,
        minHeight: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      onDragOver: e => {
        e.preventDefault();
        setOver(true);
      },
      onDragLeave: () => setOver(false),
      onDrop: e => {
        e.preventDefault();
        setOver(false);
        load(e.dataTransfer.files[0]);
      },
      style: {
        flex: 1,
        minWidth: 0,
        position: 'relative',
        alignSelf: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement(CompareSlider, {
      src: src,
      seed: 33,
      beforeBlock: bb,
      afterBlock: after,
      afterLabel: p !== null && p < 100 ? 'Traitement ' + Math.round(p) + '%' : 'Upscale ' + factor
    }), over && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--accent)',
        background: 'rgba(242,43,43,.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...lab,
        color: 'var(--text-primary)'
      }
    }, "D\xE9poser l'image")), /*#__PURE__*/React.createElement(GlassPanel, {
      tone: "solid",
      padding: 22,
      style: {
        width: 300,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignSelf: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lab
    }, "Fichier"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-bold) 17px/1.2 var(--font-display)',
        wordBreak: 'break-all'
      }
    }, name)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '10px 14px',
        font: 'var(--type-mono)',
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-tertiary)'
      }
    }, "Entr\xE9e"), /*#__PURE__*/React.createElement("span", null, dim[0], "\xD7", dim[1]), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-tertiary)'
      }
    }, "Sortie"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--accent-text)'
      }
    }, dim[0] * k, "\xD7", dim[1] * k)), /*#__PURE__*/React.createElement(Select, {
      label: "Mod\xE8le",
      icon: "cpu",
      value: model,
      onChange: setModel,
      options: [{
        value: 'photo',
        label: 'Photo réaliste'
      }, {
        value: 'video',
        label: 'Vidéo (images clés)'
      }, {
        value: 'art',
        label: 'Illustration'
      }],
      style: {
        width: '100%'
      }
    }), p !== null && /*#__PURE__*/React.createElement(ProgressBar, {
      value: p,
      tone: p === 100 ? 'success' : 'accent',
      showValue: true
    }), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      icon: "sparkles",
      fullWidth: true,
      disabled: p !== null && p < 100,
      onClick: () => setConfirm(true)
    }, p === 100 ? 'Relancer' : 'Lancer'), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      icon: "image-up",
      fullWidth: true,
      onClick: () => file.current.click()
    }, "Importer une image"), /*#__PURE__*/React.createElement("input", {
      ref: file,
      type: "file",
      accept: "image/*",
      style: {
        display: 'none'
      },
      onChange: e => load(e.target.files[0])
    }))), /*#__PURE__*/React.createElement(Dialog, {
      open: confirm,
      eyebrow: 'Upscale ' + factor,
      title: "Lancer l'am\xE9lioration ?",
      onClose: () => setConfirm(false),
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: () => setConfirm(false)
      }, "Annuler"), /*#__PURE__*/React.createElement(Button, {
        icon: "sparkles",
        onClick: () => {
          setConfirm(false);
          setP(0);
        }
      }, "Lancer"))
    }, "Le fichier sera enregistr\xE9 en ", dim[0] * k, "\xD7", dim[1] * k, " \xE0 c\xF4t\xE9 de l'original."));
  }
  window.UpscaleScreen = UpscaleScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/desktop/UpscaleScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/desktop/launch/LaunchAnimation.js
try { (() => {
(() => {
  const W = 1920,
    H = 1080;
  const STEPS = [56, 40, 28, 18, 12, 7, 4, 2, 1];
  const RES = ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p', '4K'];
  const TAG = 'DOWNLOAD EVERYTHING — UPSCALE ANYTHING';
  const RED = [242, 43, 43],
    FOG = [244, 243, 241];
  const MOTION = {
    enter: Easing.easeOutCubic,
    sweep: Easing.easeInOutSine,
    exit: Easing.easeInCubic
  };
  const mix = (a, b, k) => 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',') + ')';
  function drawParts(x, fs, w, h, cSe, c7) {
    x.font = '800 ' + fs + 'px Syne';
    x.textBaseline = 'alphabetic';
    const parts = [['se', cSe], ['7', c7], ['en', cSe]];
    const tr = -fs * .05;
    const ws = parts.map(p => x.measureText(p[0]).width);
    const tot = ws.reduce((a, b) => a + b, 0) + tr * 2;
    let cx = (w - tot) / 2;
    const by = h / 2 + fs * .34;
    parts.forEach((p, i) => {
      x.fillStyle = p[1];
      x.fillText(p[0], cx, by);
      cx += ws[i] + tr;
    });
  }
  function stepImage(si) {
    const b = STEPS[si];
    const k = si / (STEPS.length - 1);
    const fs = Math.round(H * .3);
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const x = c.getContext('2d');
    if (b === 1) {
      drawParts(x, fs, W, H, mix(RED, FOG, 1), 'rgb(242,43,43)');
      return c.toDataURL();
    }
    const lw = Math.ceil(W / b),
      lh = Math.ceil(H / b);
    const o = document.createElement('canvas');
    o.width = lw;
    o.height = lh;
    const ox = o.getContext('2d');
    drawParts(ox, fs / b, lw, lh, '#ffffff', '#ff0000');
    const px = ox.getImageData(0, 0, lw, lh).data;
    const g = b >= 4 ? Math.max(1, Math.round(b * .14)) : 0;
    const se = mix(RED, FOG, Math.pow(k, 1.4));
    for (let yy = 0; yy < lh; yy++) for (let xx = 0; xx < lw; xx++) {
      const i = (yy * lw + xx) * 4;
      if (px[i + 3] < 90) continue;
      x.fillStyle = px[i + 1] < 130 && px[i] > 150 ? 'rgb(242,43,43)' : se;
      x.fillRect(xx * b, yy * b, b - g, b - g);
    }
    return c.toDataURL();
  }
  function useSteps() {
    const [imgs, setImgs] = React.useState(null);
    React.useEffect(() => {
      let ok = true;
      Promise.race([document.fonts.load('800 200px Syne'), new Promise(r => setTimeout(r, 1500))]).then(() => {
        if (ok) setImgs(STEPS.map((_, i) => stepImage(i)));
      });
      return () => {
        ok = false;
      };
    }, []);
    return imgs;
  }
  const mono = {
    fontFamily: '"Geist Mono",monospace',
    fontWeight: 500,
    letterSpacing: '.14em',
    textTransform: 'uppercase',
    color: '#7D7C79'
  };
  function Corner({
    pos,
    rot
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderTop: '1.5px solid rgba(255,255,255,.26)',
        borderLeft: '1.5px solid rgba(255,255,255,.26)',
        transform: 'rotate(' + rot + 'deg)',
        ...pos
      }
    });
  }
  function Launch() {
    const {
      T,
      CUES,
      authoredTotal
    } = useComposition();
    const imgs = useSteps();
    const t = window.TWEAKS || {};
    const rs = CUES.Resolve,
      sw = CUES.Sweep,
      tg = CUES.Tagline,
      ex = CUES.Exit;
    const stepDur = (sw - rs) / STEPS.length;
    const si = T < rs ? -1 : Math.min(STEPS.length - 1, Math.floor((T - rs) / stepDur));
    const cursorOn = T < rs && T > 0.15 && Math.floor((T - 0.15) / 0.15) % 2 === 0;
    const xp = animate({
      from: 0,
      to: 1,
      start: ex,
      end: authoredTotal,
      ease: MOTION.exit
    })(T);
    const hud = animate({
      from: 0,
      to: 1,
      start: rs - 0.2,
      end: rs + 0.3,
      ease: MOTION.enter
    })(T) * (1 - xp);
    const sweepX = animate({
      from: -20,
      to: 120,
      start: sw,
      end: tg,
      ease: MOTION.sweep
    })(T);
    const sweepOn = T >= sw && T < tg;
    const scanY = T >= rs && T < sw ? (T - rs) / 0.6 % 1 * H : -999;
    const nChars = Math.floor(animate({
      from: 0,
      to: TAG.length,
      start: tg + 0.1,
      end: tg + 1.1,
      ease: Easing.linear
    })(T));
    const typed = TAG.slice(0, nChars);
    const breath = animate({
      from: 1,
      to: 1.02,
      start: sw,
      end: ex,
      ease: MOTION.enter
    })(T);
    const sc = breath * (1 + .08 * xp);
    const prog = Math.min(1, T / ex);
    const crisp = imgs && imgs[STEPS.length - 1];
    return /*#__PURE__*/React.createElement("div", {
      "data-screen-label": 't=' + Math.floor(T) + 's',
      style: {
        position: 'absolute',
        inset: 0,
        background: '#050505',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        transform: 'scale(' + sc + ')',
        opacity: 1 - xp
      }
    }, imgs && si >= 0 && /*#__PURE__*/React.createElement("img", {
      src: imgs[si],
      style: {
        position: 'absolute',
        inset: 0,
        width: W,
        height: H
      }
    }), crisp && sweepOn && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        WebkitMaskImage: 'url(' + crisp + ')',
        maskImage: 'url(' + crisp + ')',
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        background: 'linear-gradient(100deg,transparent ' + (sweepX - 12) + '%,rgba(255,255,255,.95) ' + sweepX + '%,transparent ' + (sweepX + 12) + '%)'
      }
    })), cursorOn && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: W / 2 - 14,
        top: H / 2 - 14,
        width: 28,
        height: 28,
        background: '#F22B2B',
        boxShadow: '0 0 40px rgba(242,43,43,.8)'
      }
    }), scanY > -999 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: scanY - 90,
        height: 90,
        background: 'linear-gradient(180deg,rgba(242,43,43,0),rgba(242,43,43,.22))'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: scanY,
        height: 2,
        background: 'rgba(255,90,90,.9)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg,rgba(255,255,255,.028) 0 1px,transparent 1px 3px)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(80% 70% at 50% 50%,transparent 40%,rgba(0,0,0,.7))'
      }
    }), t.showHud !== false && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 42,
        opacity: hud
      }
    }, /*#__PURE__*/React.createElement(Corner, {
      pos: {
        left: 0,
        top: 0
      },
      rot: 0
    }), /*#__PURE__*/React.createElement(Corner, {
      pos: {
        right: 0,
        top: 0
      },
      rot: 90
    }), /*#__PURE__*/React.createElement(Corner, {
      pos: {
        right: 0,
        bottom: 0
      },
      rot: 180
    }), /*#__PURE__*/React.createElement(Corner, {
      pos: {
        left: 0,
        bottom: 0
      },
      rot: 270
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 42,
        top: 40,
        display: 'flex',
        gap: 28,
        fontSize: 15,
        ...mono
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#F4F3F1'
      }
    }, "se7en"), /*#__PURE__*/React.createElement("span", null, "v1.0"), /*#__PURE__*/React.createElement("span", null, "init")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 42,
        top: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        fontSize: 15,
        ...mono
      }
    }, /*#__PURE__*/React.createElement("span", null, "R\xE9solution"), /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 80,
        textAlign: 'right',
        fontSize: 18,
        color: si === STEPS.length - 1 ? '#F22B2B' : '#F4F3F1'
      }
    }, si >= 0 ? RES[si] : '')), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 42,
        right: 320,
        bottom: 46,
        height: 1.5,
        background: 'rgba(255,255,255,.07)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        width: prog * 100 + '%',
        background: '#F4F3F1'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 42,
        bottom: 38,
        fontSize: 15,
        ...mono
      }
    }, "Chargement")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: H * .74,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        fontSize: 18,
        ...mono,
        letterSpacing: '.32em',
        color: '#B9B8B5',
        opacity: 1 - xp
      }
    }, typed, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-block',
        width: 12,
        height: 18,
        marginLeft: 6,
        verticalAlign: -2,
        background: '#F22B2B',
        opacity: nChars > 0 && nChars < TAG.length ? 1 : 0
      }
    })));
  }
  function Root() {
    const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
    window.TWEAKS = t;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CompositionStage, {
      width: W,
      height: H,
      bg: "#050505",
      scenes: window.OM_SCENES,
      playback: window.OM_PLAYBACK
    }, /*#__PURE__*/React.createElement(Launch, null)), /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
      label: "Animation"
    }), /*#__PURE__*/React.createElement(TweakToggle, {
      label: "Motion editor",
      value: t.motionEditor,
      onChange: v => setTweak('motionEditor', v)
    }), /*#__PURE__*/React.createElement(TweakToggle, {
      label: "HUD (coins, r\xE9solution)",
      value: t.showHud,
      onChange: v => setTweak('showHud', v)
    })));
  }
  ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(Root, null));
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/desktop/launch/LaunchAnimation.js", error: String((e && e.message) || e) }); }

// ui_kits/desktop/launch/animations-v3.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).

/* BEGIN USAGE */
// animations-v3.jsx — continuous-composition animation engine.
//
// THE MODEL: the animation is ONE element tree rendered as a pure function
// of one authored-time axis. Nothing mounts or unmounts at section
// boundaries, so any element can move, morph, or persist across them by
// ordinary interpolation. The scene list (OM_SCENES) is the user-control
// view — names, order, playback durations — and the engine derives the cue
// table from it, so structure has exactly one source and cannot drift.
//
// API INDEX (every export is a window global):
//   <CompositionStage width height scenes={window.OM_SCENES}
//                     playback={window.OM_PLAYBACK} bg>
//     <Piece />   — ONE component, the whole animation
//   </CompositionStage>
//   useComposition() -> {T, CUES, time, duration, authoredTotal, playing}
//     T: authored seconds (warped per-section by user trims/speeds) —
//        key ALL choreography to T, never to wall-clock time
//     CUES: {SectionName: authoredStart} derived from OM_SCENES; an unknown
//        name returns NaN and raises a preview-only badge (never exports);
//        duplicate section names bind to the first occurrence
//   <Shot from={CUES.Build} to={CUES.Close}> — children visible between two
//     authored times (an authored hard cut in one line); children stay
//     mounted (media keeps its readiness) and are hidden outside the window
//   <Captions items={[{at, until?, text}, ...]} /> — ONE caption element,
//     at most one visible at a time, keyed to T; 'until' defaults to the
//     next item's 'at'; a last item with no 'until' stays to the end
//   WATERCOLOR (only when the Watercolor illustration skill is active —
//   otherwise ignore these entries). A painting is a function(p) written
//   against the paint kit, on a width x height sheet; it needs
//   watercolor_kit.js loaded by a <script> tag before this engine, must
//   be a stable function defined once (module scope, never an inline
//   arrow), and every component below renders <img> elements, so it all
//   exports by construction.
//   <WatercolorPainting painting={fn} from={CUES.X} to={CUES.Y} width height
//     seed scale quality style /> — the painting assembled from its own
//     STROKES: each wash / ink line / splatter is a separate layer
//     stacked over the paper, appearing in painting order between two
//     authored times (washes bloom in, ink draws tip to tail). This is the
//     default way to show a watercolor being painted. It keeps the sheet's
//     aspect ratio (size it with style, e.g. {position:'absolute', left,
//     top, width}). scale is the layers' render resolution over width x
//     height (default 1, a deliberate weight-over-dpi trade — raise it
//     toward the zoom factor if the composition zooms into the painting,
//     or toward the devicePixelRatio for a hero-sized sheet); quality is
//     0..1 layer image quality (default 0.92; 1 is the encoder's maximum).
//   useWatercolorLayers(fn, {width, height, seed, scale, quality}) -> L
//     (null if the kit isn't loaded — load watercolor_kit.js before the
//     engine — or if the painting fails to build) — the painting taken apart into strokes, for
//     choreography beyond in-order painting: L.count strokes, L.kind(i)
//     ('wash' | 'gradedWash' | 'glaze' | 'ink' | 'hatch' | 'splatter' |
//     'dryStroke' | 'reserve' | 'caption'), L.span(i) = the stroke's
//     {from, to} share of the painting's 0..1 timeline; call L.warm()
//     once after load so finished strokes pre-render off the critical
//     path (WatercolorPainting does this itself). Compose with:
//   <WatercolorSheet layers={L} style>children</WatercolorSheet> — the
//     paper the strokes sit on (keeps the sheet's aspect ratio), and
//   <WatercolorStroke index={i} at={0..1} style /> — stroke i as its own
//     element, placed where it was painted; at is its painting progress
//     (0 hidden, 1 finished — drive it from T with animate()); style lets
//     you move, scale, rotate, or fade the stroke (transform / opacity).
//     Strokes are paint, so they multiply: overlapping strokes darken
//     where they cross, as in the still image, within a few 8-bit levels
//     (tighter still at quality 1). The sheet clips to its
//     box — for strokes that fly in from outside it, set
//     style={{overflow: 'visible'}} on the WatercolorSheet. 'reserve' strokes
//     are erasures (lifted paper) — keep them where they were painted and
//     reveal them in order after the strokes they erase; moving an erase
//     around has no sensible meaning.
//   <WatercolorReveal painting={fn} from={CUES.X} to={CUES.Y} width height
//     seed steps scale format quality style />, or <WatercolorReveal
//     frames={[src, ...]} from to /> — the whole painting as ONE flat
//     image that paints on (frames pre-baked in the background, so it is
//     the lightest option and the one to zoom or pan over as a single
//     picture). Prefer WatercolorPainting when the strokes themselves
//     should appear one by one or be individually animated. format is
//     the image MIME type (default image/jpeg), quality 0..1 (default
//     0.88). Frames bake at width x height times scale (default: the
//     device pixel ratio, capped at 2) — if the composition zooms INTO
//     the painting, raise scale toward the maximum zoom so frames stay
//     crisp. The kit caps a sheet at ~12M pixels and the components clamp
//     scale to stay under it; exported video sharpness also depends on
//     the export dialog's own resolution choice.
//   Motion: Easing.{linear, easeIn|Out|InOutQuad/Cubic/Quart/Expo/Sine,
//     easeIn|Out|InOutBack, easeOutElastic}, interpolate(input, output, ease),
//     animate({from, to, start, end, ease}) -> fn(T), clamp(v, min, max)
//   Plumbing (rarely needed): Stage, PlaybackBar, TimelineContext,
//     useTime, useTimeline
//   Seek event (host/export transport): 'data-om-seek-to-time-frame',
//     detail {time, sync, playing} — the stage owns it; never implement it
//     yourself
//
// THE AUTHORING CONTRACT — this is what makes the host timeline's trim and
// speed gestures write back into YOUR file, so follow it exactly:
//   1. Declare the scene list as a JSON string literal in a plain inline
//      <script> of the main document (NOT type="text/babel", NOT a sibling
//      .jsx — only vanilla inline scripts are addressable for write-back):
//        <script>window.OM_SCENES = '[{"name":"Opening","dur":3,"desc":"The logo fades in and the title settles"},{"name":"Build","dur":5,"desc":"Bars grow to their final values"}]';</script>
//      Give every entry a "desc": one short plain-words sentence saying
//      what happens in that section. The user reads it in the timeline's
//      section popover — keep it true whenever you edit the section.
//   2. Pass the string through untouched:
//        <CompositionStage scenes={window.OM_SCENES} ...>
//   3. ALSO declare the playback setting the same way:
//        <script>window.OM_PLAYBACK = '{"mode":"loop"}';</script>
//      and pass it through untouched (values: '{"mode":"loop"}' or
//      '{"mode":"times","count":N}'; omitting keeps loop behavior but
//      leaves the host Repeat control read-only for this document).
//   IMPORTANT — the exportable-video contract: CompositionStage/Stage OWNS
//   it (the data-om-exportable-video-with-duration-secs attribute, the
//   data-om-seek-to-time-frame listener, the svg/foreignObject wrapper,
//   and font inlining). NEVER put the exportable attribute on any other
//   element — a second "exportable root" makes the host timeline and the
//   video exporter bind to the wrong element, and playback control /
//   export silently break.
//
// HOW TIME WORKS: each OM_SCENES entry is a named slice of the authored
// timeline. CUES.Name is that section's authored start (the running sum of
// authored lengths, in literal order). useComposition().T is the authored
// clock: when the user trims or speeds a section on the host timeline, the
// engine replays that section's SAME authored slice over the new playback
// length — your choreography retimes, never cuts off. The optional "nat"
// field on an entry is the engine's authored-length anchor — the host
// timeline stamps it on the first retime; don't set it by hand.
//
// CUE-FIRST DISCIPLINE (what makes a piece read as one continuous video):
//   1. Write the OM_SCENES literal FIRST — it is the piece's outline.
//   2. One helper component per section for readability, but ALL of them
//      render ALL the time inside the one tree, keyed to CUES — never
//      conditionally mounted per section.
//   3. Define exactly three motion helpers up front (e.g.
//      MOTION = {enter, draw, pop} wrapping Easing curves) and use no
//      easing or transform outside them; one caption element, one visible
//      at a time (<Captions> has this built in).
//   A shared element that crosses a boundary is just motion whose start
//   and end straddle a cue: animate({from, to, start: CUES.Build - 0.4,
//   end: CUES.Build + 0.6})(T) glides through the boundary, and a user
//   slowing either section slows the glide without breaking it.
//
// RENDER FROM T ONLY: the exporter seeks each frame with a synchronous
// commit and may serialize the stage the moment the seek event returns —
// anything painted from useEffect or your own requestAnimationFrame lags
// that commit and exports stale. Render everything visible from T and this
// is automatic. A seeked frame is a deterministic render at that time.
//
// HARD CUTS are content now, not structure: wrap a shot's elements in
// <Shot from to> (visibility toggles at the cues; children stay mounted so
// images and videos hold their readiness). Shot also doubles as the
// perf gate for heavy far-away beats.
//
// LOOP SEAMS are the one surviving boundary rule: a looping piece shows
// its last authored frame immediately before its first — make them match
// (settle your choreography by authoredTotal, open it at 0).
//
// DIAGNOSTICS: choreography that references an unknown section name (a
// rename or deletion in OM_SCENES) shows a badge below the stage in the
// preview, outside the exportable svg — visible in preview screenshots,
// never in the exported video. An OM_SCENES section with no choreography
// keyed to it is a valid empty beat, not an error.
/* END USAGE */

// ─────────────────────────────────────────────────────────────────────────────

// ── Easing functions (hand-rolled, Popmotion-style) ─────────────────────────
// All easings take t ∈ [0,1] and return eased t ∈ [0,1] (may overshoot for back/elastic).
const Easing = {
  linear: t => t,
  // Quad
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  // Cubic
  easeInCubic: t => t * t * t,
  easeOutCubic: t => --t * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // Quart
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - --t * t * t * t,
  easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  // Expo
  easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: t => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
    return 1 - 0.5 * Math.pow(2, -20 * t + 10);
  },
  // Sine
  easeInSine: t => 1 - Math.cos(t * Math.PI / 2),
  easeOutSine: t => Math.sin(t * Math.PI / 2),
  easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  // Back (overshoot)
  easeOutBack: t => {
    const c1 = 1.70158,
      c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInBack: t => {
    const c1 = 1.70158,
      c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeInOutBack: t => {
    const c1 = 1.70158,
      c2 = c1 * 1.525;
    return t < 0.5 ? Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2) / 2 : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
  // Elastic
  easeOutElastic: t => {
    const c4 = 2 * Math.PI / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
};

// ── Core interpolation helpers ──────────────────────────────────────────────

// Clamp a value to [min, max]
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// interpolate([0, 0.5, 1], [0, 100, 50], ease?) -> fn(t)
// Popmotion-style: linearly maps t across input keyframes to output values,
// with optional easing per segment (single fn or array of fns).
function interpolate(input, output, ease = Easing.linear) {
  return t => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        const easeFn = Array.isArray(ease) ? ease[i] || Easing.linear : ease;
        const eased = easeFn(local);
        return output[i] + (output[i + 1] - output[i]) * eased;
      }
    }
    return output[output.length - 1];
  };
}

// animate({from, to, start, end, ease})(t) — simpler single-segment tween.
// Returns `from` before `start`, `to` after `end`.
function animate({
  from = 0,
  to = 1,
  start = 0,
  end = 1,
  ease = Easing.easeInOutCubic
}) {
  return t => {
    if (t <= start) return from;
    if (t >= end) return to;
    const local = (t - start) / (end - start);
    return from + (to - from) * ease(local);
  };
}

// ── Timeline context ────────────────────────────────────────────────────────

const TimelineContext = React.createContext({
  time: 0,
  duration: 10,
  playing: false
});
const useTime = () => React.useContext(TimelineContext).time;
const useTimeline = () => React.useContext(TimelineContext);

// How long a marked (detail.playing === true) host seek keeps the
// external-playback latch alive with no successor. The host play bar's
// seek pump is one-in-flight/latest-wins, so its inter-seek gap is tens
// of milliseconds in the worst case — 400ms is far above that, so a
// marked stream that dies mid-play decays the latch promptly.
var SS_EXT_PLAY_MS = 400;

// ── Font inlining ───────────────────────────────────────────────────────────
// Copy every @font-face rule from the page into a <style> inside the svg's
// foreignObject, with font URLs rewritten to data: URLs. Makes the svg
// self-describing so serializing it alone (video export fast path) still
// renders with the right fonts. Sets data-om-fonts-inlined on the svg when
// done so the exporter can wait for it.

function useInlineFontsInto(svgRef) {
  React.useEffect(() => {
    const svg = svgRef.current;
    const host = svg && svg.querySelector('foreignObject > div');
    if (!svg || !host) return;
    let cancelled = false;
    (async () => {
      const rules = [];
      for (const ss of document.styleSheets) {
        let cssRules;
        try {
          cssRules = ss.cssRules;
        } catch {
          // Cross-origin sheet without crossorigin attr (e.g. the standard
          // fonts.googleapis.com <link>) — fetch the CSS text directly and
          // regex-extract the @font-face blocks.
          if (ss.href) {
            try {
              const txt = await fetch(ss.href).then(r => {
                if (!r.ok) throw 0;
                return r.text();
              });
              for (const ff of txt.match(/@font-face\s*{[^}]*}/g) || []) rules.push({
                css: ff,
                base: ss.href
              });
            } catch {}
          }
          continue;
        }
        if (!cssRules) continue;
        for (const r of cssRules) {
          if (r.type === CSSRule.FONT_FACE_RULE) {
            rules.push({
              css: r.cssText,
              base: ss.href || location.href
            });
          }
        }
      }
      const toDataURL = url => fetch(url).then(r => {
        if (!r.ok) throw 0;
        return r.blob();
      }).then(b => new Promise(res => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result);
        fr.onerror = () => res(url);
        fr.readAsDataURL(b);
      })).catch(() => url);
      const parts = await Promise.all(rules.map(async ({
        css,
        base
      }) => {
        const re = /url\((['"]?)([^'")]+)\1\)/g;
        let out = css,
          m;
        while (m = re.exec(css)) {
          const u = m[2];
          if (u.startsWith('data:')) continue;
          let abs;
          try {
            abs = new URL(u, base).href;
          } catch {
            continue;
          }
          out = out.split(m[0]).join(`url("${await toDataURL(abs)}")`);
        }
        return out;
      }));
      if (cancelled || !parts.length) {
        svg.setAttribute('data-om-fonts-inlined', 'true');
        return;
      }
      const style = document.createElement('style');
      style.textContent = parts.join('\n');
      host.insertBefore(style, host.firstChild);
      svg.setAttribute('data-om-fonts-inlined', 'true');
    })();
    return () => {
      cancelled = true;
    };
  }, []);
}
function Stage({
  width = 1280,
  height = 720,
  duration = 10,
  background = '#f6f4ef',
  fps = 60,
  loop = true,
  autoplay = true,
  // Parsed playback object ({mode:'loop'} | {mode:'times',count:N}) or
  // null. When present it overrides the legacy loop prop — CompositionStage
  // passes the validated value from the OM_PLAYBACK authoring contract.
  playback = null,
  persistKey = 'animstage-v3',
  children
}) {
  // Props arrive as strings when Stage is mounted via <x-import> (DC
  // projects) — coerce so style={{width}} gets a number React can px-ify.
  width = +width || 1280;
  height = +height || 720;
  duration = +duration || 10;
  fps = +fps || 60;
  if (typeof loop === 'string') loop = loop !== 'false';
  if (typeof autoplay === 'string') autoplay = autoplay !== 'false';
  const playTimes = playback && playback.mode === 'times' ? playback.count : null;
  const loopEff = playback ? playback.mode === 'loop' : loop;
  const [time, setTime] = React.useState(() => {
    try {
      const v = parseFloat(localStorage.getItem(persistKey + ':t') || '0');
      return isFinite(v) ? clamp(v, 0, duration) : 0;
    } catch {
      return 0;
    }
  });
  const [playing, setPlaying] = React.useState(autoplay);
  // The external-playback latch: true while the HOST play bar is driving
  // time forward as genuine continuous playback (its play-loop seeks
  // carry detail.playing === true). The engine's own clock stays paused
  // the whole time — exactly one clock ever drives — so this is a
  // separate bit, not a second meaning for `playing`. Set and cleared
  // in the seek handler below; decays via SS_EXT_PLAY_MS when the
  // marked stream stops without a parting unmarked seek.
  const [extPlay, setExtPlay] = React.useState(false);
  const extPlayTimerRef = React.useRef(null);
  const [hoverTime, setHoverTime] = React.useState(null);
  const [scale, setScale] = React.useState(1);
  const stageRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const lastTsRef = React.useRef(null);

  // Persist playhead
  React.useEffect(() => {
    try {
      localStorage.setItem(persistKey + ':t', String(time));
    } catch {}
  }, [time, persistKey]);

  // Auto-scale to fit viewport
  React.useEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current;
    const measure = () => {
      const barH = 44; // playback bar height
      const s = Math.min(el.clientWidth / width, (el.clientHeight - barH) / height);
      setScale(Math.max(0.05, s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [width, height]);

  // Passes completed since playback last started. Lives in a ref so the
  // per-frame wrap can count without re-running this effect; reset on
  // every (re)start so a fresh play (or a host restart) gets the full
  // run count again.
  const passesRef = React.useRef(0);

  // Animation loop
  React.useEffect(() => {
    if (!playing) {
      lastTsRef.current = null;
      return;
    }
    passesRef.current = 0;
    const step = ts => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime(t => {
        let next = t + dt;
        if (next >= duration) {
          if (playTimes !== null) {
            // Play N times then hold the last frame — the partial pass a
            // mid-timeline start produces counts as a pass, so the piece
            // never runs longer than N full durations.
            passesRef.current += 1;
            if (passesRef.current >= playTimes) {
              next = duration;
              setPlaying(false);
            } else {
              next = next % duration;
            }
          } else if (loopEff) {
            next = next % duration;
          } else {
            next = duration;
            setPlaying(false);
          }
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [playing, duration, loopEff, playTimes]);

  // Keyboard: space = play/pause, ← → = seek
  React.useEffect(() => {
    const onKey = e => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setPlaying(p => !p);
      } else if (e.code === 'ArrowLeft') {
        setTime(t => clamp(t - (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.code === 'ArrowRight') {
        setTime(t => clamp(t + (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.key === '0' || e.code === 'Home') {
        setTime(0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [duration]);

  // Video-export protocol + the editor's play bar: hosts dispatch this
  // event per frame; pause + sync the playhead so the frame shows exactly
  // that timestamp. The host play bar marks its play-loop seeks with
  // detail.playing === true — the mark latches extPlay (playback is
  // playback even when a host clock drives it), while ANY unmarked seek
  // (scrub, step, export frame, the transport's pause park) clears the
  // latch in the same commit it retimes, so a seeked frame still renders
  // exactly one scene's state. The engine's own clock pauses either way.
  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    // Sync-seek capability: a dispatcher that marks its seek with
    // detail.sync === true gets the commit applied via ReactDOM.flushSync,
    // so the stage DOM reflects the seeked frame the moment dispatchEvent
    // returns. The video exporter keys off the data-om-sync-seek
    // advertisement to drop its two-display-refresh settle (that wait only
    // exists to let React's async commit land — serialization needs the
    // committed DOM, not the paint). Feature-detected: a runtime without
    // ReactDOM.flushSync never advertises and every seek takes the async
    // path. Unmarked seeks (scrubs, the host play bar) stay async — a
    // forced sync render per pointermove would tax the editor for no one.
    const canSyncSeek = typeof ReactDOM !== 'undefined' && typeof ReactDOM.flushSync === 'function';
    const onSeek = e => {
      const apply = () => {
        setPlaying(false);
        const hostPlay = !!(e.detail && e.detail.playing === true);
        if (extPlayTimerRef.current) {
          clearTimeout(extPlayTimerRef.current);
          extPlayTimerRef.current = null;
        }
        if (hostPlay) {
          // Watchdog: the latch is only as alive as its seek stream. If the
          // host stops without a parting seek (tab jank, bar unmount), the
          // latch decays on its own rather than stranding extPlaying true.
          extPlayTimerRef.current = setTimeout(() => {
            extPlayTimerRef.current = null;
            setExtPlay(false);
          }, SS_EXT_PLAY_MS);
        }
        setExtPlay(hostPlay);
        setTime(clamp(e.detail.time, 0, duration));
      };
      // flushSync is safe here: a native DOM listener runs outside React's
      // lifecycle, and the exporter's dispatchEvent is synchronous, so the
      // commit lands in the same JS task — the engine's own rAF loop can
      // never interleave between seek and serialize.
      if (canSyncSeek && e.detail && e.detail.sync === true) {
        ReactDOM.flushSync(apply);
      } else {
        apply();
      }
    };
    el.addEventListener('data-om-seek-to-time-frame', onSeek);
    if (canSyncSeek) el.setAttribute('data-om-sync-seek', 'true');
    return () => {
      el.removeEventListener('data-om-seek-to-time-frame', onSeek);
      el.removeAttribute('data-om-sync-seek');
      if (extPlayTimerRef.current) {
        clearTimeout(extPlayTimerRef.current);
        extPlayTimerRef.current = null;
      }
      // Drop the latch too: this cleanup runs on every duration change
      // (an agent edit can retime mid-host-play, no gesture involved) and
      // the new effect instance arms no watchdog — clearing only the
      // timer could strand extPlay true forever if the marked stream died
      // in the gap. Fail toward cut: the next marked seek re-latches.
      setExtPlay(false);
    };
  }, [duration]);

  // Inline @font-face rules into the svg's foreignObject so the svg is
  // self-describing — serializing it alone (for video export) then renders
  // with the right fonts. Sets data-om-fonts-inlined once done.
  useInlineFontsInto(canvasRef);
  const displayTime = hoverTime != null ? hoverTime : time;
  const ctxValue = React.useMemo(
  // extPlaying is ADDITIVE: "time is advancing under an external
  // driver's continuous playback". `playing` keeps meaning the
  // engine's OWN clock — the hidden PlaybackBar glyph (and through it
  // the host's clock-reporter/adoption channel) reads that — and
  // CompositionClock is the one consumer that widens to either.
  () => ({
    time: displayTime,
    duration,
    playing,
    extPlaying: extPlay,
    setTime,
    setPlaying
  }), [displayTime, duration, playing, extPlay]);
  return (
    /*#__PURE__*/
    // data-om-starter: inert presence marker — Claude Design's starter-usage
    // probe reads it; it renders nothing. Keep it on this root element.
    React.createElement("div", {
      ref: stageRef,
      "data-om-starter": "animations-v3",
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#0a0a0a',
        fontFamily: 'Inter, system-ui, sans-serif'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        minHeight: 0
      }
    }, /*#__PURE__*/React.createElement("svg", {
      ref: canvasRef,
      width: width,
      height: height,
      "data-om-exportable-video-with-duration-secs": duration,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        flexShrink: 0,
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("foreignObject", {
      x: "0",
      y: "0",
      width: "100%",
      height: "100%"
    }, /*#__PURE__*/React.createElement("div", {
      xmlns: "http://www.w3.org/1999/xhtml",
      style: {
        width,
        height,
        background,
        position: 'relative',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement(TimelineContext.Provider, {
      value: ctxValue
    }, children))))), /*#__PURE__*/React.createElement(PlaybackBar, {
      time: displayTime,
      actualTime: time,
      duration: duration,
      playing: playing,
      onPlayPause: () => setPlaying(p => !p),
      onReset: () => {
        setTime(0);
      },
      onSeek: t => setTime(t),
      onHover: t => setHoverTime(t)
    }))
  );
}

// ── Playback bar ────────────────────────────────────────────────────────────
// Play/pause, return-to-begin, scrub track, time display.
// Uses fixed-width time fields so layout doesn't thrash.

function PlaybackBar({
  time,
  duration,
  playing,
  onPlayPause,
  onReset,
  onSeek,
  onHover
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const timeFromEvent = React.useCallback(e => {
    const rect = trackRef.current.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    return x * duration;
  }, [duration]);
  const onTrackMove = e => {
    if (!trackRef.current) return;
    const t = timeFromEvent(e);
    if (dragging) {
      onSeek(t);
    } else {
      onHover(t);
    }
  };
  const onTrackLeave = () => {
    if (!dragging) onHover(null);
  };
  const onTrackDown = e => {
    setDragging(true);
    const t = timeFromEvent(e);
    onSeek(t);
    onHover(null);
  };
  React.useEffect(() => {
    if (!dragging) return;
    const onUp = () => setDragging(false);
    const onMove = e => {
      if (!trackRef.current) return;
      const t = timeFromEvent(e);
      onSeek(t);
    };
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
    };
  }, [dragging, timeFromEvent, onSeek]);
  const pct = duration > 0 ? time / duration * 100 : 0;
  const fmt = t => {
    const total = Math.max(0, t);
    const m = Math.floor(total / 60);
    const s = Math.floor(total % 60);
    const cs = Math.floor(total * 100 % 100);
    return `${String(m).padStart(1, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };
  const mono = 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace';
  return /*#__PURE__*/React.createElement("div", {
    "data-omelette-chrome": true,
    style: {
      // Slimmed to visually match the host editor bar's basic row (the
      // single-scrubber look): transport first, tighter metrics, quieter
      // chrome. Shown only outside the app — the host bar suppresses this
      // whenever it is present.
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 12px',
      background: 'rgba(20,20,20,0.92)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      width: '100%',
      maxWidth: 680,
      alignSelf: 'center',
      borderRadius: 6,
      color: '#f6f4ef',
      fontFamily: 'Inter, system-ui, sans-serif',
      userSelect: 'none',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    onClick: onPlayPause,
    title: "Play/pause (space)"
  }, playing ? /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "2",
    width: "3",
    height: "10",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "8",
    y: "2",
    width: "3",
    height: "10",
    fill: "currentColor"
  })) : /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 2l9 5-9 5V2z",
    fill: "currentColor"
  }))), /*#__PURE__*/React.createElement(IconButton, {
    onClick: onReset,
    title: "Return to start (0)"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 2v10M12 2L5 7l7 5V2z",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: mono,
      fontSize: 12,
      fontVariantNumeric: 'tabular-nums',
      width: 64,
      textAlign: 'right',
      color: '#f6f4ef'
    }
  }, fmt(time)), /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    onMouseMove: onTrackMove,
    onMouseLeave: onTrackLeave,
    onMouseDown: onTrackDown,
    style: {
      flex: 1,
      height: 22,
      position: 'relative',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 4,
      background: 'rgba(255,255,255,0.12)',
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      width: `${pct}%`,
      height: 4,
      background: 'oklch(72% 0.12 250)',
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: `${pct}%`,
      top: '50%',
      width: 12,
      height: 12,
      marginLeft: -6,
      marginTop: -6,
      background: '#fff',
      borderRadius: 6,
      boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: mono,
      fontSize: 12,
      fontVariantNumeric: 'tabular-nums',
      width: 64,
      textAlign: 'left',
      color: 'rgba(246,244,239,0.55)'
    }
  }, fmt(duration)), typeof VideoEncoder !== 'undefined' && /*#__PURE__*/React.createElement(IconButton, {
    title: "Export video",
    onClick: () => window.parent.postMessage({
      type: 'omelette:request-video-export'
    }, '*')
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 2v7m0 0L4 6m3 3l3-3M2 12h10",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))));
}
function IconButton({
  children,
  onClick,
  title
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    title: title,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: 24,
      height: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: hover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 5,
      color: '#f6f4ef',
      cursor: 'pointer',
      padding: 0,
      transition: 'background 120ms'
    }
  }, children);
}

// ── Scene-list plumbing ──────────────────────────────────────────────────
// Guest-side validation of a scene list (the engine's own inputs: the
// authored prop, and host-dispatched updates). Mirrors the host parser's
// shape rules and constants — keep in sync with parseTimelineScenes in
// apps/web/src/shared/timeline.ts (16KB raw cap, 50 entries, dur finite in
// (0, 300]); returns null on any violation.
function ssParse(raw) {
  if (typeof raw !== 'string' || !raw || raw.length > 16 * 1024) return null;
  var parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return null;
  }
  if (!Array.isArray(parsed) || parsed.length === 0 || parsed.length > 50) return null;
  for (var i = 0; i < parsed.length; i++) {
    var s = parsed[i];
    if (typeof s !== 'object' || s === null) return null;
    if (typeof s.name !== 'string' || typeof s.dur !== 'number') return null;
    if (!isFinite(s.dur) || s.dur <= 0 || s.dur > 300) return null;
  }
  return parsed;
}

// Guest-side validation of the playback value — mirrors the host parser
// (shared/timeline.ts parseTimelinePlayback): {"mode":"loop"} or
// {"mode":"times","count":1..99}, strict all-or-nothing, null otherwise.
// Callers treat null as the loop default.
function ppParse(raw) {
  if (typeof raw !== 'string' || !raw || raw.length > 256) return null;
  var parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;
  var keys = Object.keys(parsed);
  if (parsed.mode === 'loop') return keys.length === 1 ? {
    mode: 'loop'
  } : null;
  if (parsed.mode === 'times') {
    if (keys.length !== 2) return null;
    var c = parsed.count;
    if (typeof c !== 'number' || c !== Math.floor(c) || c < 1 || c > 99) return null;
    return {
      mode: 'times',
      count: c
    };
  }
  return null;
}

// Stamps the playback attribute VERBATIM from the authored raw string (the
// host's write-back anchors on that exact value) and listens for the
// host's post-write update event. Same shape as SceneSync; only rendered
// when the document authors a playback literal — an absent contract means
// the attribute stays absent and the document plays its default.
function PlaybackSync(props) {
  var ref = React.useRef(null);
  var raw = props.raw;
  var onUpdate = props.onUpdate;
  React.useEffect(function () {
    var el = ref.current;
    if (!el) return;
    var root = el.closest('[data-om-exportable-video-with-duration-secs]');
    if (!root) return;
    root.setAttribute('data-om-timeline-playback', raw);
    var onEvent = function (e) {
      var next = e && e.detail;
      if (ppParse(next)) onUpdate(next);
    };
    root.addEventListener('data-om-timeline-playback-update', onEvent);
    return function () {
      root.removeEventListener('data-om-timeline-playback-update', onEvent);
      root.removeAttribute('data-om-timeline-playback');
    };
  }, [raw, onUpdate]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      display: 'none'
    }
  });
}

// Renders inside the Stage (so it can reach the exportable root via
// closest()): stamps the scenes attribute VERBATIM from the current raw
// string — the host's write-back anchors on that exact value — and listens
// for the host's post-write update event.
function SceneSync(props) {
  var ref = React.useRef(null);
  var raw = props.raw;
  var onUpdate = props.onUpdate;
  React.useEffect(function () {
    var el = ref.current;
    if (!el) return;
    var root = el.closest('[data-om-exportable-video-with-duration-secs]');
    if (!root) return;
    root.setAttribute('data-om-timeline-scenes', raw);
    var onEvent = function (e) {
      var next = e && e.detail;
      // Ignore anything that doesn't validate — a bad update must not tear
      // down a working composition.
      if (ssParse(next)) onUpdate(next);
    };
    root.addEventListener('data-om-timeline-scenes-update', onEvent);
    return function () {
      root.removeEventListener('data-om-timeline-scenes-update', onEvent);
      root.removeAttribute('data-om-timeline-scenes');
    };
  }, [raw, onUpdate]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      display: 'none'
    }
  });
}

// ── Continuous composition ──────────────────────────────────────────────

var CompositionContext = React.createContext(null);
function useComposition() {
  var ctx = React.useContext(CompositionContext);
  if (!ctx) throw new Error('useComposition() must be called inside <CompositionStage>');
  return ctx;
}
function ccDerive(scenes) {
  var playStart = 0;
  var authStart = 0;
  var sections = [];
  var table = Object.create(null);
  for (var i = 0; i < scenes.length; i++) {
    var s = scenes[i];
    var nat = typeof s.nat === 'number' && isFinite(s.nat) && s.nat > 0 ? s.nat : s.dur;
    sections.push({
      name: s.name,
      playStart: playStart,
      dur: s.dur,
      authStart: authStart,
      nat: nat
    });
    if (!Object.prototype.hasOwnProperty.call(table, s.name)) {
      table[s.name] = Math.round(authStart * 1000) / 1000;
    }
    playStart += s.dur;
    authStart += nat;
  }
  return {
    sections: sections,
    table: table,
    total: Math.round(playStart * 1000) / 1000,
    authoredTotal: Math.round(authStart * 1000) / 1000
  };
}
function ccWarp(d, t) {
  var ss = d.sections;
  if (ss.length === 0) return 0;
  var idx = ss.length - 1;
  for (var i = 0; i < ss.length; i++) {
    if (t < ss[i].playStart + ss[i].dur) {
      idx = i;
      break;
    }
  }
  var s = ss[idx];
  var local = Math.min(Math.max(t - s.playStart, 0), s.dur);
  var T = s.authStart + (s.dur > 0 ? local * (s.nat / s.dur) : 0);
  return Math.min(T, d.authoredTotal);
}
var CC_META = Object.assign(Object.create(null), {
  toString: 1,
  toLocaleString: 1,
  valueOf: 1,
  toJSON: 1,
  then: 1,
  constructor: 1,
  hasOwnProperty: 1,
  isPrototypeOf: 1,
  propertyIsEnumerable: 1,
  default: 1
});
function ccCueProxy(table, unknownRef) {
  if (typeof Proxy !== 'function') return table;
  return new Proxy(table, {
    get: function (target, prop) {
      if (typeof prop !== 'string' || prop in target) return target[prop];
      if (CC_META[prop] || prop.indexOf('@@') === 0) return Object.prototype[prop];
      unknownRef.current[prop] = true;
      return NaN;
    }
  });
}
function CcUnknownWatch(props) {
  var tl = useTimeline();
  React.useEffect(function () {
    var next = Object.keys(props.unknownRef.current).sort().join(', ');
    if (next !== props.badge) props.setBadge(next);
  }, [tl.time]);
  return null;
}
function CompositionClock(props) {
  var tl = useTimeline();
  var d = props.derived;
  var T = ccWarp(d, tl.time);
  var value = React.useMemo(function () {
    return {
      T: T,
      CUES: props.cues,
      time: tl.time,
      duration: tl.duration,
      authoredTotal: d.authoredTotal,
      playing: tl.playing || tl.extPlaying === true
    };
  }, [T, props.cues, tl.time, tl.duration, d, tl.playing, tl.extPlaying]);
  return /*#__PURE__*/React.createElement(CompositionContext.Provider, {
    value: value
  }, props.children);
}
function Shot(props) {
  var c = useComposition();
  var from = +props.from;
  var to = props.to == null ? Infinity : +props.to;
  var on = isFinite(from) && c.T >= from && c.T < to;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      visibility: on ? 'visible' : 'hidden'
    }
  }, props.children);
}
var CAPTION_FADE = 0.18;
function Captions(props) {
  var c = useComposition();
  var t = c.T;
  var items = (props.items || []).filter(function (it) {
    return it && isFinite(+it.at);
  }).sort(function (a, b) {
    return a.at - b.at;
  });
  var active = null;
  var end = Infinity;
  for (var i = 0; i < items.length; i++) {
    if (t < items[i].at) break;
    active = items[i];
    end = typeof active.until === 'number' && isFinite(active.until) ? active.until : i + 1 < items.length ? items[i + 1].at : Infinity;
  }
  if (!active || t >= end) return null;
  var o = Math.min(1, (t - active.at) / CAPTION_FADE);
  if (isFinite(end)) o = Math.min(o, (end - t) / CAPTION_FADE);
  o = Math.max(0, Math.min(1, o));
  return /*#__PURE__*/React.createElement("div", {
    "data-om-caption": true,
    style: Object.assign({
      position: 'absolute',
      left: '8%',
      right: '8%',
      bottom: '7%',
      textAlign: 'center',
      opacity: o,
      pointerEvents: 'none',
      font: '500 30px Inter, system-ui, sans-serif',
      color: '#f6f4ef',
      textShadow: '0 1px 14px rgba(0,0,0,0.45)'
    }, props.style)
  }, active.text);
}
function CompositionStage(props) {
  var width = +props.width || 1280;
  var height = +props.height || 720;
  var bg = props.bg || '#0b0b0e';
  var autoplay = props.autoplay == null ? true : String(props.autoplay) !== 'false';
  var loop = props.loop == null ? true : String(props.loop) !== 'false';
  var state = React.useState(props.scenes);
  var raw = state[0];
  var setRaw = state[1];
  var scenes = React.useMemo(function () {
    return ssParse(raw);
  }, [raw]);
  var pstate = React.useState(props.playback);
  var praw = pstate[0];
  var setPraw = pstate[1];
  var pb = React.useMemo(function () {
    return ppParse(praw);
  }, [praw]);
  var unknownRef = React.useRef({});
  var badgeState = React.useState('');
  var badge = badgeState[0];
  var setBadge = badgeState[1];
  var derived = React.useMemo(function () {
    unknownRef.current = {};
    return scenes ? ccDerive(scenes) : null;
  }, [scenes]);
  var cues = React.useMemo(function () {
    return derived ? ccCueProxy(derived.table, unknownRef) : null;
  }, [derived]);
  React.useEffect(function () {
    var next = Object.keys(unknownRef.current).sort().join(', ');
    if (next !== badge) setBadge(next);
  });
  if (!scenes) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b0b0e',
        color: '#c96442',
        font: '500 16px Inter, system-ui, sans-serif',
        textAlign: 'center'
      }
    }, "animations-v3: the scenes prop isn't a valid JSON scene list", /*#__PURE__*/React.createElement("br", null), "(expected '[", '{', "\"name\":\"\u2026\",\"dur\":N", '}', ", \u2026]')");
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Stage, {
    width: width,
    height: height,
    duration: derived.total,
    background: bg,
    autoplay: autoplay,
    loop: loop,
    playback: pb
  }, /*#__PURE__*/React.createElement(SceneSync, {
    raw: raw,
    onUpdate: setRaw
  }), typeof praw === 'string' && praw !== '' && /*#__PURE__*/React.createElement(PlaybackSync, {
    raw: praw,
    onUpdate: setPraw
  }), /*#__PURE__*/React.createElement(CompositionClock, {
    derived: derived,
    cues: cues
  }, props.children), /*#__PURE__*/React.createElement(CcUnknownWatch, {
    unknownRef: unknownRef,
    badge: badge,
    setBadge: setBadge
  })), badge !== '' &&
  /*#__PURE__*/
  // Sibling of Stage, outside the exportable <svg>: visible in the
  // preview (and its screenshots), never in the exported video.
  React.createElement("div", {
    "data-om-unknown-cues": true,
    style: {
      position: 'absolute',
      left: 12,
      bottom: 56,
      zIndex: 10,
      padding: '6px 10px',
      borderRadius: 6,
      background: 'rgba(0,0,0,0.72)',
      color: '#e8906a',
      font: '500 12px Inter, system-ui, sans-serif',
      pointerEvents: 'none'
    }
  }, "choreography references unknown section", badge.indexOf(',') >= 0 ? 's' : '', ": ", badge));
}

// Strokes as layers: paint multiplies, so stroke images stacked with
// mix-blend-mode:multiply over the paper reproduce the flat render.

var WC_PIXEL_CAP = 11000000;
function wcLayerOpts(props) {
  var w = +props.width || 900,
    h = +props.height || 1200;
  var askScale = +props.scale || 1;
  return {
    width: w,
    height: h,
    scale: Math.min(askScale, Math.sqrt(WC_PIXEL_CAP / (w * h))),
    seed: props.seed == null ? undefined : +props.seed,
    quality: props.quality == null ? undefined : +props.quality
  };
}
var wcWarned = {};
function wcWarnOnce(key, message, err) {
  if (wcWarned[key]) return;
  wcWarned[key] = true;
  console.warn(message, err);
}
function useWatercolorLayers(painting, opts) {
  var kit = window.WatercolorKit;
  if (typeof painting !== 'function' || !kit || typeof kit.layers !== 'function') return null;
  try {
    return kit.layers(painting, wcLayerOpts(opts || {}));
  } catch (e) {
    wcWarnOnce('layers:' + e, 'watercolor painting failed to build; rendering the fallback sheet', e);
    return null;
  }
}
var WatercolorSheetContext = React.createContext(null);
function WatercolorSheet(props) {
  var L = props.layers || null;
  var style = Object.assign({
    position: 'relative',
    display: 'block',
    width: '100%',
    aspectRatio: L ? L.width + ' / ' + L.height : '3 / 4',
    isolation: 'isolate',
    overflow: 'hidden'
  }, props.style);
  if (!L) {
    return /*#__PURE__*/React.createElement("div", {
      style: Object.assign(style, {
        background: '#f4f1e8',
        color: '#8a8270',
        font: '12px system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      })
    }, "watercolor-kit.js not loaded (or the painting failed to build)");
  }
  return /*#__PURE__*/React.createElement(WatercolorSheetContext.Provider, {
    value: L
  }, /*#__PURE__*/React.createElement("div", {
    style: style,
    "data-om-watercolor-sheet": true
  }, /*#__PURE__*/React.createElement("img", {
    src: L.paper,
    alt: props.alt || '',
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      display: 'block'
    }
  }), props.children));
}
function WatercolorStroke(props) {
  var fromSheet = React.useContext(WatercolorSheetContext);
  var L = props.layers || fromSheet;
  if (!L) return null;
  var i = +props.index;
  if (!(i >= 0) || i >= L.count) return null;
  var at = props.at == null ? 1 : clamp(+props.at, 0, 1);
  if (!(at > 0)) return null;
  var box, src;
  try {
    box = L.box(i);
    src = box ? L.src(i, at) : null;
  } catch (e) {
    wcWarnOnce('stroke:' + i + ':' + e, 'watercolor stroke ' + i + ' failed to render; skipping it', e);
    return null;
  }
  if (!box || !src) return null;
  var style = Object.assign({
    position: 'absolute',
    display: 'block',
    left: box.x * 100 + '%',
    top: box.y * 100 + '%',
    width: box.w * 100 + '%',
    height: box.h * 100 + '%',
    mixBlendMode: L.kind(i) === 'reserve' ? 'normal' : 'multiply',
    pointerEvents: 'none'
  }, props.style);
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    "data-om-watercolor-stroke": i,
    "data-om-stroke-kind": L.kind(i),
    style: style
  });
}

// The default watercolor moment: the painting assembled from its strokes,
// each appearing in painting order (a pure function of T).
function WatercolorPainting(props) {
  var c = useComposition();
  var from = +props.from || 0;
  var to = props.to == null ? from + 6 : +props.to;
  var u = clamp((c.T - from) / Math.max(to - from, 0.001), 0, 1);
  var eased = Easing.easeInOutQuad(u);
  var L = useWatercolorLayers(props.painting, props);
  var tick = React.useState(0)[1];
  var warmed = React.useRef(null);
  React.useEffect(function () {
    if (!L || typeof L.warm !== 'function') return;
    var p = L.warm();
    if (warmed.current === p) return;
    var live = true;
    p.then(function () {
      warmed.current = p;
      if (live) tick(function (x) {
        return x + 1;
      });
    });
    return function () {
      live = false;
    };
  }, [L && L.paper, props.painting]);
  var strokes = [];
  if (L) {
    for (var i = 0; i < L.count; i++) {
      var sp = L.span(i);
      var at = clamp((eased - sp.from) / Math.max(sp.to - sp.from, 1e-6), 0, 1);
      if (at <= 0) break;
      strokes.push(/*#__PURE__*/React.createElement(WatercolorStroke, {
        key: i,
        layers: L,
        index: i,
        at: at
      }));
    }
  }
  return /*#__PURE__*/React.createElement(WatercolorSheet, {
    layers: L,
    style: props.style,
    alt: props.alt
  }, strokes);
}

// Paint-on watercolor reveal as a pure function of T — an <img> with a data:
// URL (the exporter serializes those as-is; a live canvas would export blank).
function WatercolorReveal(props) {
  var c = useComposition();
  var from = +props.from || 0;
  var to = props.to == null ? from + 6 : +props.to;
  var u = clamp((c.T - from) / Math.max(to - from, 0.001), 0, 1);
  var style = Object.assign({
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  }, props.style);
  var frames = Array.isArray(props.frames) && props.frames.length ? props.frames : null;
  var steps = frames ? frames.length - 1 : Math.max(1, Math.round(+props.steps || 36));
  var i = Math.min(steps, Math.round(Easing.easeInOutQuad(u) * steps));
  var painting = typeof props.painting === 'function' ? props.painting : null;
  var kit = window.WatercolorKit;
  var w = +props.width || 900,
    h = +props.height || 1200;
  var askScale = +props.scale || Math.min(2, window.devicePixelRatio || 1);
  var opts = {
    width: w,
    height: h,
    scale: Math.min(askScale, Math.sqrt(11000000 / (w * h))),
    seed: props.seed == null ? undefined : +props.seed,
    steps: steps,
    type: props.format || 'image/jpeg',
    quality: props.quality == null ? 0.88 : +props.quality
  };
  var key = opts.width + 'x' + opts.height + '#' + opts.seed + '@' + opts.scale + '/' + steps + ':' + opts.type + '/' + opts.quality;
  var cache = React.useRef({
    fn: null,
    key: '',
    frames: {},
    baking: false
  }).current;
  var tick = React.useState(0)[1];
  if (cache.fn !== painting && String(cache.fn) !== String(painting) || cache.key !== key) {
    cache.key = key;
    cache.frames = {};
    cache.baking = false;
  }
  cache.fn = painting;
  React.useEffect(function () {
    if (frames || cache.baking || !painting || !kit || typeof kit.bake !== 'function') return;
    cache.baking = true;
    var target = cache.frames;
    try {
      kit.bake(painting, opts, function (n, _t, url) {
        target[n] = url;
      }).then(function (all) {
        if (cache.frames !== target) return;
        for (var n = 0; n < all.length; n++) target[n] = all[n];
        tick(function (x) {
          return x + 1;
        });
      }).catch(function () {
        /* failed bake: the guarded lazy path below still renders */
      });
    } catch (e) {
      /* oversized painting: the guarded lazy path below still renders */
    }
  });
  if (frames) return /*#__PURE__*/React.createElement("img", {
    src: frames[i],
    alt: props.alt || '',
    style: style
  });
  if (!kit || !painting) {
    return /*#__PURE__*/React.createElement("div", {
      style: Object.assign({
        width: '100%',
        height: '100%',
        background: '#f4f1e8',
        color: '#8a8270',
        font: '12px system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }, props.style)
    }, "watercolor-kit.js not loaded (or no painting function)");
  }
  if (!cache.frames[i]) {
    try {
      cache.frames[i] = kit.frame(painting, Object.assign({}, opts, {
        at: i / steps
      }));
    } catch (e) {
      return /*#__PURE__*/React.createElement("div", {
        style: Object.assign({
          width: '100%',
          height: '100%',
          background: '#f4f1e8',
          color: '#8a8270',
          font: '12px system-ui, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }, props.style)
      }, "painting too large to render (", String(e && e.message).slice(0, 80), ")");
    }
  }
  return /*#__PURE__*/React.createElement("img", {
    src: cache.frames[i],
    alt: props.alt || '',
    style: style
  });
}
Object.assign(window, {
  Easing,
  interpolate,
  animate,
  clamp,
  TimelineContext,
  useTime,
  useTimeline,
  Stage,
  PlaybackBar,
  CompositionStage,
  useComposition,
  Shot,
  Captions,
  WatercolorReveal,
  WatercolorPainting,
  WatercolorSheet,
  WatercolorStroke,
  useWatercolorLayers
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/desktop/launch/animations-v3.js", error: String((e && e.message) || e) }); }

// ui_kits/desktop/launch/tweaks-panel.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  // data-om-starter: inert presence marker — Claude Design's starter-usage
  // probe reads it. The closed panel renders nothing, so the marker rides
  // the <html> element as an attribute instead of a rendered node — zero
  // elements added, so page CSS (even structural selectors like
  // :nth-child) can never observe it. It records that the page WIRES a
  // tweaks panel, whether or not the panel is open. Keep this effect.
  React.useEffect(() => {
    document.documentElement.setAttribute('data-om-starter', 'tweaks-panel');
    return () => document.documentElement.removeAttribute('data-om-starter');
  }, []);
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/desktop/launch/tweaks-panel.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.StepIndex = __ds_scope.StepIndex;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Segmented = __ds_scope.Segmented;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.UrlInput = __ds_scope.UrlInput;

__ds_ns.CompareSlider = __ds_scope.CompareSlider;

__ds_ns.DownloadItem = __ds_scope.DownloadItem;

__ds_ns.GlassPanel = __ds_scope.GlassPanel;

__ds_ns.MediaFrame = __ds_scope.MediaFrame;

__ds_ns.PixelImage = __ds_scope.PixelImage;

})();
