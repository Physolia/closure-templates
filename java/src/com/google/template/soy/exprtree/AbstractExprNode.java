/*
 * Copyright 2008 Google Inc.
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

package com.google.template.soy.exprtree;

import com.google.template.soy.basetree.AbstractNode;


/**
 * Abstract implementation of an ExprNode.
 *
 * <p> Important: Do not use outside of Soy code (treat as superpackage-private).
 *
 */
public abstract class AbstractExprNode extends AbstractNode implements ExprNode {


  @Override public ParentExprNode getParent() {
    return (ParentExprNode) super.getParent();
  }


  protected AbstractExprNode() {}


  /**
   * Copy constructor.
   * @param orig The node to copy.
   */
  protected AbstractExprNode(AbstractExprNode orig) {
    super(orig);
  }


  @Override public abstract ExprNode clone();

}
