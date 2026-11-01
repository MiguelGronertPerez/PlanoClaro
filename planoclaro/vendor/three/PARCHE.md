# Parche local
Única modificación a `three.min.js` (r159, UMD): se reemplazó el `console.warn` de aviso de obsolescencia del build UMD por `void 0`, para que la consola quede limpia. El build UMD se usa a propósito porque los módulos ES no cargan desde `file://`.
