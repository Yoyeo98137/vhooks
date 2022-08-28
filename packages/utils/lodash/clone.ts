import { isRef } from 'vue';
import { isArray, isAsyncFunction, isFunction } from '../ifType';

/** 函数克隆（仅接收思路，实际没有应用场景） */
function cloneFunction(func: any) {
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  // 函数输出为字符串，方便通过正则进行查找 函数体、参数体
  const funcString = func.toString();
  console.log('🏄 #### cloneFunction #### funcString', funcString);

  if (func.prototype) {
    console.log('普通函数');

    const param = paramReg.exec(funcString);
    const body = bodyReg.exec(funcString);

    if (body) {
      console.log('匹配到函数体：', body[0]);

      if (param) {
        const paramArr = param[0].split(',');
        console.log('匹配到参数：', paramArr);

        return new Function(...paramArr, body[0]);
      } else {
        return new Function(body[0]);
      }
    } else {
      return null;
    }
  } else {
    // 主要就是区分这点：箭头函数没有 prototype
    // eval() 函数会将传入的字符串当做 JavaScript 代码进行执行
    return eval(funcString);

    // anonymous ???
    // actually an anonymous function - 匿名函数
    // 倒也没错，箭头函数确实是匿名函数...

    // return Function(func);
  }
}

/**
 * 深拷贝
 *
 * How deep-clone?
 *
 * 在 JS 中分为两种变量类型：基本类型和引用类型
 * 两种类型在执行拷贝时的表现是不同的
 *
 * - 基本类型：值拷贝，开辟新空间来存储值，新旧变量的修改不会相互影响
 *            基本类型的值是直接存储在内存中的
 * - 引用类型：指针拷贝，新旧变量共用同一个指针，最终指向的是同一个地址，修改会彼此影响
 *            引用类型在内存中存储的值其实是一个 指向堆内存对象的地址指针
 *
 * 深拷贝就是为了让引用类型在拷贝的时候，也通过开辟新空间来新建变量
 *
 * Plus:
 * @see: https://segmentfault.com/a/1190000020255831
 */

function deepClone<T>(target: T, map?: Map<T, T>): T;
function deepClone<T>(target: T, map = new Map()) {
  // step
  // 1 区分变量类型，如果是基本类型则直接返回值
  // 2 如果是引用类型，则需要开辟新空间，再通过遍历手动赋值
  //      - [x] 如果当前对象（引用类型）又包含有嵌套对象，就要继续定位到嵌套对象去进行拷贝，即递归
  //      - [x] 现在新建空间的方式用的是 {}，还需要兼容 数组 格式
  //      - [ ] 还有其他的类型拷贝，比如 函数、正则、Set、Map 等
  //      - [ ] for-in 的遍历性能较差，可以尝试通过 while 手写实现
  // 3 抛出结果变量
  // 4 循环引用问题：当原对象内的属性存在自身指向时会出现，导致递归爆栈
  //      @see: https://jishuin.proginn.com/p/763bfbd65bed
  //      这时利用缓存的思想，额外创建缓存空间（哈希，或者数组都可以），用来判断当前对象是否已经被拷贝过了
  //      这里可以延伸出关于 Map 和 WeakMap 结构的区别，先使用 Map 来实现

  // 基本类型直接抛出
  if (!(target instanceof Object)) return target;

  // 引用类型，则需要新开辟空间来存储
  const isTargetArray = isArray(target);
  const copyTarget: T = (isTargetArray ? [] : {}) as T;

  // 判断是否命中缓存
  if (map.has(target)) {
    return map.get(target);
  }
  map.set(target, copyTarget);

  // 通过遍历的方式，给新空间补充定义值
  for (const key in target) {
    // todo too bad...
    // 兼容 响应式对象 值拷贝
    if (isRef(target[key])) {
      // class ComputedRefImpl - this.__v_isRef = true;
      // Object.getOwnPropertyDescriptor(a, "_value")
      // configurable
      // value

      // 在拷贝过程中，保留响应式的引用来提供自定义操作可能性
      // 而不去改变值的结构
      copyTarget[key] = target[key];
      // copyTarget[key] = target[key].value;
      continue;
    }

    // 实际上克隆函数是没有实际应用场景的，
    // 两个对象使用一个在内存中处于同一个地址的函数也是没有任何问题的，
    // 像 lodash 中对函数的拷贝，也是直接将值返回了
    // if (isFunction(target[key])) {
    //   copyTarget[key] = cloneFunction(target[key]);
    //   // copyTarget[key] = target[key];
    //   continue;
    // }

    // 识别到函数，直接返回
    if (isFunction(target[key]) || isAsyncFunction(target[key])) {
      copyTarget[key] = target[key];
      continue;
    }

    // console.log("🏄 #### key", key, target[key]);
    copyTarget[key] = deepClone(target[key], map);
  }

  return copyTarget;
}

export default deepClone;
