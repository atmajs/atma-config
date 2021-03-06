import { Config } from '../../src/ConfigNode';
import { File, Directory } from 'atma-io';

UTest({
    $before: remove,
    //$after: remove,
    async 'write'() {
        let config = new Config({
            path: path_JSON,
            writable: true
        });

        await config.$write({
            foo: 'baz',
            arr: [1]
        });

        let cfg = await File.readAsync<any>(path_JSON);

        eq_(cfg.foo, 'baz');
        deepEq_(cfg.arr, [1]);

    },
    async 'write extend'() {
        let config = await Config.fetch({
            path: path_JSON,
            writable: true
        });

        await config.$write({ arr: [2] })

        let cfg = File.read<any>(path_JSON);
        eq_(cfg.foo, 'baz');
        deepEq_(cfg.arr, [1, 2]);
    },
    async 'write after read'() {
        let config = await Config.fetch({
            path: path_JSON,
            writable: true
        });

        deepEq_(config.toJSON(), {
            foo: 'baz',
            arr: [1, 2]
        });

        await config.$write({ qux: 'quux', arr: [3] });

        var cfg = File.read<any>(path_JSON);
        deepEq_(cfg, {
            qux: 'quux',
            foo: 'baz',
            arr: [1, 2, 3]
        });

    },
    // async 'should write yaml'() {
    //     var config = new Config({
    //         path: path_YML,
    //         writable: true
    //     });

    //     await config.$write({
    //         foo: 'baz'
    //     })

    //     var txt = File.read(path_YML, { skipHooks: true });

    //     has_(txt, 'foo: baz');

    // },
    async 'should write json to any generic extension'() {
        var config = new Config({
            path: path_TXT,
            writable: true
        });
        await config
            .$write({
                foo: 'baz'
            });

        var txt = File.read(path_TXT, { skipHooks: true });

        has_(txt, '{"foo":"baz"}');
    }
})

var path_JSON = 'test/bin/write.json',
    path_YML = 'test/bin/write.yml',
    path_TXT = 'test/bin/write.txt'

function remove() {
    Directory.remove('test/bin/');

}
