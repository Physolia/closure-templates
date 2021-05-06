/*
 * Copyright 2009 Google Inc.
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

package com.google.template.soy;

import com.google.common.collect.ImmutableMap;
import com.google.common.io.CharSource;
import com.google.template.soy.base.SourceFilePath;
import com.google.template.soy.base.SourceLocation;
import com.google.template.soy.data.internalutils.InternalValueUtils;
import com.google.template.soy.data.restricted.PrimitiveData;
import com.google.template.soy.error.ErrorReporter;
import com.google.template.soy.error.SoyErrorKind;
import com.google.template.soy.exprtree.ExprNode;
import com.google.template.soy.exprtree.ExprNode.PrimitiveNode;
import com.google.template.soy.exprtree.GlobalNode;
import com.google.template.soy.exprtree.VarRefNode;
import com.google.template.soy.soyparse.SoyFileParser;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Public utilities for Soy users.
 *
 */
public final class SoyUtils {

  // Error types for bad lines in the compile-time globals file.
  private static final SoyErrorKind INVALID_FORMAT =
      SoyErrorKind.of("Invalid globals line format ''{0}''.");
  private static final SoyErrorKind INVALID_VALUE =
      SoyErrorKind.of("Invalid global value ''{0}''.");
  private static final SoyErrorKind NON_PRIMITIVE_VALUE =
      SoyErrorKind.of("Non-primitive global value ''{0}''.");

  private SoyUtils() {}

  /**
   * Generates the text for a compile-time globals file in the format expected by the Soy compiler
   * and appends the generated text to the given {@code Appendable}.
   *
   * <p>The generated lines will follow the iteration order of the provided map.
   *
   * <p>Important: When you write the output to a file, be sure to use UTF-8 encoding.
   *
   * @param compileTimeGlobalsMap Map from compile-time global name to value. The values can be any
   *     of the Soy primitive types: null, boolean, integer, float (Java double), or string.
   * @param output The object to append the generated text to.
   * @throws IllegalArgumentException If one of the values is not a valid Soy primitive type.
   * @throws IOException If there is an error appending to the given {@code Appendable}.
   * @deprecated Use Soy constants instead.
   */
  @Deprecated
  public static void generateCompileTimeGlobalsFile(
      Map<String, ?> compileTimeGlobalsMap, Appendable output) throws IOException {

    Map<String, PrimitiveData> compileTimeGlobals =
        InternalValueUtils.convertCompileTimeGlobalsMap(compileTimeGlobalsMap);

    for (Map.Entry<String, PrimitiveData> entry : compileTimeGlobals.entrySet()) {
      String valueSrcStr =
          InternalValueUtils.convertPrimitiveDataToExpr(entry.getValue(), SourceLocation.UNKNOWN)
              .toSourceString();
      output.append(entry.getKey()).append(" = ").append(valueSrcStr).append("\n");
    }
  }

  /** Pattern for one line in the compile-time globals file. */
  // Note: group 1 = key, group 2 = value.
  private static final Pattern COMPILE_TIME_GLOBAL_LINE =
      Pattern.compile("([a-zA-Z_][a-zA-Z_0-9.]*) \\s* = \\s* (.+)", Pattern.COMMENTS);

  /**
   * Parses a globals file in the format created by {@link #generateCompileTimeGlobalsFile} into a
   * map from global name to primitive value.
   *
   * @param inputSource A source that returns a reader for the globals file.
   * @return The parsed globals map.
   * @throws IOException If an error occurs while reading the globals file.
   * @throws IllegalStateException If the globals file is not in the correct format.
   * @deprecated Use Soy constants instead.
   */
  @Deprecated
  public static ImmutableMap<String, PrimitiveData> parseCompileTimeGlobals(CharSource inputSource)
      throws IOException {
    ImmutableMap.Builder<String, PrimitiveData> compileTimeGlobalsBuilder = ImmutableMap.builder();
    ErrorReporter errorReporter = ErrorReporter.exploding();

    try (BufferedReader reader = inputSource.openBufferedStream()) {
      int lineNum = 1;
      for (String line = reader.readLine(); line != null; line = reader.readLine(), ++lineNum) {

        if (line.startsWith("//") || line.trim().length() == 0) {
          continue;
        }

        SourceLocation sourceLocation =
            new SourceLocation(SourceFilePath.create("globals"), lineNum, 1, lineNum, 1);

        Matcher matcher = COMPILE_TIME_GLOBAL_LINE.matcher(line);
        if (!matcher.matches()) {
          errorReporter.report(sourceLocation, INVALID_FORMAT, line);
          continue;
        }
        String name = matcher.group(1);
        String valueText = matcher.group(2).trim();

        ExprNode valueExpr = SoyFileParser.parseExprOrDie(valueText);

        // Record error for non-primitives.
        // TODO: Consider allowing non-primitives (e.g. list/map literals).
        if (!(valueExpr instanceof PrimitiveNode)) {
          if (valueExpr instanceof GlobalNode || valueExpr instanceof VarRefNode) {
            errorReporter.report(sourceLocation, INVALID_VALUE, valueExpr.toSourceString());
          } else {
            errorReporter.report(sourceLocation, NON_PRIMITIVE_VALUE, valueExpr.toSourceString());
          }
          continue;
        }

        // Default case.
        compileTimeGlobalsBuilder.put(
            name, InternalValueUtils.convertPrimitiveExprToData((PrimitiveNode) valueExpr));
      }
    }
    return compileTimeGlobalsBuilder.build();
  }
}
