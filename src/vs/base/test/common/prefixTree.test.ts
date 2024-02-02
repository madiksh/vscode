/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WellDefinedPrefixTree } from 'vs/base/common/prefixTree';
import * as assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from 'vs/base/test/common/utils';

suite('WellDefinedPrefixTree', () => {
	let tree: WellDefinedPrefixTree<number>;

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		tree = new WellDefinedPrefixTree<number>();
	});

	// 1. "Test: Run Tests with Coverage in Current File", show `find` in prefixTree.ts is uncovered
	// 2. uncomment this test case and run it
	// 3. it fails, and debug it. Set a breakpoint on `tree.find(['foo', 'baz', 'bop'])`
	//    and a triggered breakpoint on the `return` in prefixTree.ts
	// 4. Apply the fix given in the comment in prefixTree.ts
	// 5. Re-run with coverage. Toggle Inline Coverage and show the nice count badges :)

	// test('find', () => {
	// 	const key1 = ['foo', 'bar'];
	// 	const key2 = ['foo', 'baz'];
	// 	tree.insert(key1, 42);
	// 	tree.insert(key2, 43);
	// 	assert.strictEqual(tree.find(key1), 42);
	// 	assert.strictEqual(tree.find(key2), 43);
	// 	assert.strictEqual(tree.find(['foo', 'baz', 'bop']), undefined);
	// 	assert.strictEqual(tree.find(['foo']), undefined);
	// });

	test('hasParentOfKey', () => {
		const key = ['foo', 'bar'];
		tree.insert(key, 42);

		assert.strictEqual(tree.hasKeyOrParent(['foo', 'bar', 'baz']), true);
		assert.strictEqual(tree.hasKeyOrParent(['foo', 'bar']), true);
		assert.strictEqual(tree.hasKeyOrParent(['foo']), false);
		assert.strictEqual(tree.hasKeyOrParent(['baz']), false);
	});


	test('hasKeyOrChildren', () => {
		const key = ['foo', 'bar'];
		tree.insert(key, 42);

		assert.strictEqual(tree.hasKeyOrChildren([]), true);
		assert.strictEqual(tree.hasKeyOrChildren(['foo']), true);
		assert.strictEqual(tree.hasKeyOrChildren(['foo', 'bar']), true);
		assert.strictEqual(tree.hasKeyOrChildren(['foo', 'bar', 'baz']), false);
	});

	test('hasKey', () => {
		const key = ['foo', 'bar'];
		tree.insert(key, 42);

		assert.strictEqual(tree.hasKey(key), true);
		assert.strictEqual(tree.hasKey(['foo']), false);
		assert.strictEqual(tree.hasKey(['baz']), false);
		assert.strictEqual(tree.hasKey(['foo', 'bar', 'baz']), false);
	});

	test('size', () => {
		const key1 = ['foo', 'bar'];
		const key2 = ['foo', 'baz'];
		assert.strictEqual(tree.size, 0);
		tree.insert(key1, 42);
		assert.strictEqual(tree.size, 1);
		tree.insert(key2, 43);
		assert.strictEqual(tree.size, 2);
		tree.insert(key2, 44);
		assert.strictEqual(tree.size, 2);
	});

	test('mutate', () => {
		const key1 = ['foo', 'bar'];
		const key2 = ['foo', 'baz'];
		tree.insert(key1, 42);
		tree.insert(key2, 43);
		tree.mutate(key1, (value) => {
			assert.strictEqual(value, 42);
			return 44;
		});
		// assert.strictEqual(tree.find(key1), 44);
		// assert.strictEqual(tree.find(key2), 43);
	});

	test('delete', () => {
		const key1 = ['foo', 'bar'];
		const key2 = ['foo', 'baz'];
		tree.insert(key1, 42);
		tree.insert(key2, 43);
		assert.strictEqual(tree.size, 2);

		assert.strictEqual(tree.delete(key1), 42);
		assert.strictEqual(tree.size, 1);
		// assert.strictEqual(tree.find(key1), undefined);
		// assert.strictEqual(tree.find(key2), 43);

		assert.strictEqual(tree.delete(key2), 43);
		assert.strictEqual(tree.size, 0);
		// assert.strictEqual(tree.find(key1), undefined);
		// assert.strictEqual(tree.find(key2), undefined);

		tree.delete(key2);
		assert.strictEqual(tree.size, 0);
	});

	test('delete child', () => {
		const key1 = ['foo', 'bar'];
		const key2 = ['foo', 'bar', 'baz'];
		tree.insert(key1, 42);
		tree.insert(key2, 43);
		assert.strictEqual(tree.size, 2);

		assert.strictEqual(tree.delete(key2), 43);
		assert.strictEqual(tree.size, 1);
		// assert.strictEqual(tree.find(key1), 42);
		// assert.strictEqual(tree.find(key2), undefined);
	});

	test('delete noops if deleting parent', () => {
		const key1 = ['foo', 'bar'];
		const key2 = ['foo', 'bar', 'baz'];
		tree.insert(key2, 43);
		assert.strictEqual(tree.size, 1);

		assert.strictEqual(tree.delete(key1), undefined);
		assert.strictEqual(tree.size, 1);
		// assert.strictEqual(tree.find(key2), 43);
		// assert.strictEqual(tree.find(key1), undefined);
	});

	test('values', () => {
		const key1 = ['foo', 'bar'];
		const key2 = ['foo', 'baz'];
		tree.insert(key1, 42);
		tree.insert(key2, 43);

		assert.deepStrictEqual([...tree.values()], [43, 42]);
	});


	test('delete recursive', () => {
		const key1 = ['foo', 'bar'];
		const key2 = ['foo', 'bar', 'baz'];
		const key3 = ['foo', 'bar', 'baz2', 'baz3'];
		const key4 = ['foo', 'bar2'];
		tree.insert(key1, 42);
		tree.insert(key2, 43);
		tree.insert(key3, 44);
		tree.insert(key4, 45);
		assert.strictEqual(tree.size, 4);

		assert.deepStrictEqual([...tree.deleteRecursive(key1)], [42, 44, 43]);
		assert.strictEqual(tree.size, 1);

		assert.deepStrictEqual([...tree.deleteRecursive(key1)], []);
		assert.strictEqual(tree.size, 1);

		assert.deepStrictEqual([...tree.deleteRecursive(key4)], [45]);
		assert.strictEqual(tree.size, 0);
	});
});
