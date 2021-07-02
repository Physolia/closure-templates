/*
 * Copyright 2021 Google Inc.
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
package com.google.template.soy.plugin;

import java.util.List;
import java.util.function.Consumer;

/** Collects multiple MethodCheckers and delegates to each of them. */
public final class DelegatingMethodChecker implements MethodChecker {
  private final List<MethodChecker> methodCheckers;

  public DelegatingMethodChecker(List<MethodChecker> methodCheckers) {
    this.methodCheckers = methodCheckers;
  }

  @Override
  public boolean hasMethod(
      String className,
      String methodName,
      String returnType,
      List<String> arguments,
      boolean inInterface,
      Consumer<String> errorReporter) {
    for (MethodChecker methodChecker : methodCheckers) {
      if (methodChecker.hasMethod(
          className, methodName, returnType, arguments, inInterface, errorReporter)) {
        return true;
      }
    }
    return false;
  }
}
