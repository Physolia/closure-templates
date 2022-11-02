/*
 * Copyright 2015 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview
 * Value converters for protocol buffers in Soy that are semantically
 * similar to Soy builtin types.
 *
 * <p>Calls to these are generated by
 * com.google.template.soy.types.proto.SoyProtoTypeImpl.
 *
 */

goog.module('soy.converters');

const Const = goog.require('goog.string.Const');
const ReadonlySafeHtmlProto = goog.requireType('proto.html.ReadonlySafeHtmlProto');
const ReadonlySafeScriptProto = goog.requireType('proto.html.ReadonlySafeScriptProto');
const ReadonlySafeStyleProto = goog.requireType('proto.html.ReadonlySafeStyleProto');
const ReadonlySafeStyleSheetProto = goog.requireType('proto.html.ReadonlySafeStyleSheetProto');
const ReadonlySafeUrlProto = goog.requireType('proto.html.ReadonlySafeUrlProto');
const ReadonlyTrustedResourceUrlProto = goog.requireType('proto.html.ReadonlyTrustedResourceUrlProto');
const SafeHtml = goog.require('goog.html.SafeHtml');
const SafeHtmlProto = goog.require('proto.webutil.html.types.SafeHtmlProto');
const SafeScript = goog.require('goog.html.SafeScript');
const SafeScriptProto = goog.require('proto.webutil.html.types.SafeScriptProto');
const SafeStyle = goog.require('goog.html.SafeStyle');
const SafeStyleProto = goog.require('proto.webutil.html.types.SafeStyleProto');
const SafeStyleSheet = goog.require('goog.html.SafeStyleSheet');
const SafeStyleSheetProto = goog.require('proto.webutil.html.types.SafeStyleSheetProto');
const SafeUrl = goog.require('goog.html.SafeUrl');
const SafeUrlProto = goog.require('proto.webutil.html.types.SafeUrlProto');
const TrustedResourceUrl = goog.require('goog.html.TrustedResourceUrl');
const TrustedResourceUrlProto = goog.require('proto.webutil.html.types.TrustedResourceUrlProto');
const googDebug = goog.require('goog.debug');
const googString = goog.require('goog.string');
const jspbconversions = goog.require('security.html.jspbconversions');
const soy = goog.require('soy');
const uncheckedconversions = goog.require('goog.html.uncheckedconversions');
const {ByteString} = goog.require('jspb.bytestring');
const {SanitizedCss, SanitizedHtml, SanitizedJs, SanitizedTrustedResourceUri, SanitizedUri} = goog.require('goog.soy.data');

/**
 * Converts a CSS Sanitized Content object to a corresponding Safe Style Proto.
 * @param {!SanitizedCss|string} sanitizedCss
 * @return {!SafeStyleProto}
 */
exports.packSanitizedCssToSafeStyleProtoSoyRuntimeOnly = function(
    sanitizedCss) {
  if (sanitizedCss !== '' && !(sanitizedCss instanceof SanitizedCss)) {
    throw new Error(
        'expected SanitizedCss, got ' + googDebug.runtimeType(sanitizedCss));
  }

  // Sanity check: Try to prevent accidental misuse when this is a full
  // stylesheet rather than a declaration list. The error may trigger
  // incorrectly if the content contains curly brackets inside comments or
  // quoted strings.
  //
  // This is a best-effort attempt to preserve SafeStyle's semantic guarantees.
  if (sanitizedCss &&
      googString.contains(
          /** @type {!SanitizedCss} */ (sanitizedCss).getContent(), '{')) {
    throw new Error('Consider using packSanitizedCssToSafeStyleSheetProto().');
  }

  const safeStyle =
      uncheckedconversions.safeStyleFromStringKnownToSatisfyTypeContract(
          Const.from('from Soy SanitizedCss object'),
          sanitizedCss ?
              /** @type {!SanitizedCss} */ (sanitizedCss).getContent() :
              '');
  return jspbconversions.safeStyleToProto(safeStyle);
};


/**
 * Converts a CSS Sanitized Content object to a corresponding Safe Style Sheet
 * Proto.
 * @param {!SanitizedCss|string} sanitizedCss
 * @return {!SafeStyleSheetProto}
 */
exports.packSanitizedCssToSafeStyleSheetProtoSoyRuntimeOnly = function(
    sanitizedCss) {
  if (sanitizedCss !== '' && !(sanitizedCss instanceof SanitizedCss)) {
    throw new Error(
        'expected SanitizedCss, got ' + googDebug.runtimeType(sanitizedCss));
  }

  // Sanity check: Try to prevent accidental misuse when this is a declaration
  // list rather than a full stylesheet. The error may trigger incorrectly if
  // the content contains curly brackets inside comments or quoted strings.
  //
  // This is a best-effort attempt to preserve SafeStyleSheet's semantic
  // guarantees.
  if (sanitizedCss &&
      /** @type {!SanitizedCss} */ (sanitizedCss).getContent().length > 0 &&
      !googString.contains(
          /** @type {!SanitizedCss} */ (sanitizedCss).getContent(), '{')) {
    throw new Error('Consider using packSanitizedCssToSafeStyleProto().');
  }

  const safeStyleSheet =
      uncheckedconversions.safeStyleSheetFromStringKnownToSatisfyTypeContract(
          Const.from('from Soy SanitizedCss object'),
          sanitizedCss ?
              /** @type {!SanitizedCss} */ (sanitizedCss).getContent() :
              '');
  return jspbconversions.safeStyleSheetToProto(safeStyleSheet);
};


/**
 * Converts an HTML Sanitized Content object to a corresponding
 * Safe String Proto.
 * @param {!SanitizedHtml|string|!soy.IdomFunction|!Function}
 *     sanitizedHtml
 * @return {!SafeHtmlProto}
 */
exports.packSanitizedHtmlToProtoSoyRuntimeOnly = function(sanitizedHtml) {
  if (sanitizedHtml !== '' && !(sanitizedHtml instanceof SanitizedHtml)) {
    throw new Error(
        'expected SanitizedHtml, got ' + googDebug.runtimeType(sanitizedHtml));
  }
  const content = sanitizedHtml ?
      /** @type {!SanitizedHtml} */ (sanitizedHtml).getContent() :
      '';
  const safeHtml =
      uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(
          Const.from('from Soy SanitizedHtml object'), content);
  return jspbconversions.safeHtmlToProto(safeHtml);
};


/**
 * Converts a JS Sanitized Content object to a corresponding Safe Script Proto.
 * @param {!SanitizedJs|string} sanitizedJs
 * @return {!SafeScriptProto}
 */
exports.packSanitizedJsToProtoSoyRuntimeOnly = function(sanitizedJs) {
  if (sanitizedJs !== '' && !(sanitizedJs instanceof SanitizedJs)) {
    throw new Error(
        'expected SanitizedJs, got ' + googDebug.runtimeType(sanitizedJs));
  }
  const safeScript =
      uncheckedconversions.safeScriptFromStringKnownToSatisfyTypeContract(
          Const.from('from Soy SanitizedJs object'),
          sanitizedJs ? /** @type {!SanitizedJs} */ (sanitizedJs).getContent() :
                        '');
  return jspbconversions.safeScriptToProto(safeScript);
};


/**
 * Converts a Trusted Resource URI Sanitized Content object to a corresponding
 * Trusted Resource URL Proto.
 * @param {!SanitizedTrustedResourceUri|string}
 *     sanitizedTrustedResourceUri
 * @return {!TrustedResourceUrlProto}
 */
exports.packSanitizedTrustedResourceUriToProtoSoyRuntimeOnly = function(
    sanitizedTrustedResourceUri) {
  if (sanitizedTrustedResourceUri !== '' &&
      !(sanitizedTrustedResourceUri instanceof SanitizedTrustedResourceUri)) {
    throw new Error(
        'expected SanitizedTrustedResourceUri, got ' +
        googDebug.runtimeType(sanitizedTrustedResourceUri));
  }
  const trustedResourceUrl =
      uncheckedconversions
          .trustedResourceUrlFromStringKnownToSatisfyTypeContract(
              Const.from('from Soy SanitizedTrustedResourceUri object'),
              sanitizedTrustedResourceUri ?
                  /** @type {!SanitizedTrustedResourceUri} */ (
                      sanitizedTrustedResourceUri)
                      .getContent() :
                  '');
  return jspbconversions.trustedResourceUrlToProto(trustedResourceUrl);
};


/**
 * Converts a URI Sanitized Content object to a corresponding Safe URL Proto.
 * @param {!SanitizedUri|string} sanitizedUri
 * @return {!SafeUrlProto}
 */
exports.packSanitizedUriToProtoSoyRuntimeOnly = function(sanitizedUri) {
  if (sanitizedUri !== '' && !(sanitizedUri instanceof SanitizedUri)) {
    throw new Error(
        'expected SanitizedUri, got ' + googDebug.runtimeType(sanitizedUri));
  }
  const safeUrl =
      uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract(
          Const.from('from Soy SanitizedUri object'),
          sanitizedUri ?
              /** @type {!SanitizedUri} */ (sanitizedUri).getContent() :
              '');
  return jspbconversions.safeUrlToProto(safeUrl);
};


/**
 * Converts a Safe String Proto to HTML Sanitized Content.
 * @param {?ReadonlySafeHtmlProto|undefined} x null or a safe string proto.
 * @return {?SanitizedHtml}
 */
exports.unpackProtoToSanitizedHtml = function(x) {
  if (x instanceof SafeHtmlProto) {
    const safeHtml = jspbconversions.safeHtmlFromProto(x);
    return soy.VERY_UNSAFE.ordainSanitizedHtml(
        SafeHtml.unwrap(safeHtml));
  }
  return null;
};


/**
 * Converts a Safe String Proto to CSS Sanitized Content.
 * @param {?ReadonlySafeStyleProto | ?ReadonlySafeStyleSheetProto | undefined} x
 *   null or a safe string proto.
 * @return {?SanitizedCss}
 */
exports.unpackProtoToSanitizedCss = function(x) {
  let safeCss;
  if (x instanceof SafeStyleProto) {
    safeCss = jspbconversions.safeStyleFromProto(x);
    return soy.VERY_UNSAFE.ordainSanitizedCss(SafeStyle.unwrap(safeCss));
  } else if (x instanceof SafeStyleSheetProto) {
    safeCss = jspbconversions.safeStyleSheetFromProto(x);
    return soy.VERY_UNSAFE.ordainSanitizedCss(SafeStyleSheet.unwrap(safeCss));
  }
  return null;
};


/**
 * Converts a Safe String Proto to JS Sanitized Content.
 * @param {?ReadonlySafeScriptProto | undefined} x null or a safe string proto.
 * @return {?SanitizedJs}
 */
exports.unpackProtoToSanitizedJs = function(x) {
  if (x instanceof SafeScriptProto) {
    const safeJs = jspbconversions.safeScriptFromProto(x);
    return soy.VERY_UNSAFE.ordainSanitizedJs(SafeScript.unwrap(safeJs));
  }
  return null;
};


/**
 * Converts a Safe String Proto to URI Sanitized Content.
 * @param {?ReadonlySafeUrlProto | ?ReadonlyTrustedResourceUrlProto | undefined}
 *     x
 *   null or a safe string proto.
 * @return {?SanitizedUri}
 */
exports.unpackProtoToSanitizedUri = function(x) {
  if (x instanceof SafeUrlProto) {
    const safeUrl = jspbconversions.safeUrlFromProto(x);
    return soy.VERY_UNSAFE.ordainSanitizedUri(SafeUrl.unwrap(safeUrl));
  }
  return null;
};


/**
 * Converts a Safe String Proto to a Trusted Resource URI Sanitized Content.
 * @param {?ReadonlyTrustedResourceUrlProto | undefined} x
 *   null or a safe string proto.
 * @return {?SanitizedTrustedResourceUri}
 */
exports.unpackProtoToSanitizedTrustedResourceUri = function(x) {
  if (x instanceof TrustedResourceUrlProto) {
    const safeUrl = jspbconversions.trustedResourceUrlFromProto(x);
    return soy.VERY_UNSAFE.ordainSanitizedTrustedResourceUri(
        TrustedResourceUrl.unwrap(safeUrl));
  }
  return null;
};

/**
 * Processes the return value of a proto bytes field so that it is consistently
 * formatted as base64 text.
 *
 * @return {?string|undefined}
 */
exports.unpackByteStringToBase64String = function(
    /** ?ByteString|undefined*/ bytes) {
  if (bytes == null) {
    return bytes;
  }
  if (bytes instanceof ByteString) {
    return bytes.asBase64();
  }
  throw new Error('unsupported bytes value: ' + bytes);
};

/**
 * Processes the return value of a proto bytes field so that it is consistently
 * formatted as base64 text.
 *
 * @return {!ByteString}
 */
exports.packBase64StringToByteString = function(/** string*/ bytes) {
  return ByteString.fromBase64(bytes);
};
