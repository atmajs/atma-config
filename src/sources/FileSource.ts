import { cfg_extend } from '../util/cfg';
import { path_handleSpecialFolder } from '../util/path';
import { SourceFactory } from './SourceFactory';
import { file_readSourceAsync, file_readSourceSync } from './utils/file';
import { File } from 'atma-io';
import { IDataFile, IDataFiles, ISource } from './ISource';


SourceFactory.register('file', {

    canHandle(data: IDataFile) {
        var path = data.path;
        if (typeof path !== 'string')
            return false;

        if (path.search(/[\*\?]/g) !== -1)
            // wildcards - directory source
            return false;

        if (path[path.length - 1] === '/') {
            // directory
            return false;
        }

        return true;
    },
    create (data: IDataFile) {
        return new FileSource(data);
    }
});


class FileSource implements ISource {
    data
    config

    constructor(data: IDataFile) {
        this.data = data;
        this.config = {};
        data.path = path_handleSpecialFolder(data.path);
    }
    promise: Promise<this>;


    async read(rootConfig) {
        let config = await file_readSourceAsync(
            rootConfig,
            this.data.path,
            this.data
        );

        this.config = config;
        return this;
    }

    readSync(rootConfig) {
        this.config = file_readSourceSync(
            rootConfig,
            this.data.path,
            this.data
        );
        return this;
    }

    async write(config, deepExtend, setterProperty) {
        if (this.data.writable !== true) {
            throw new Error('Not writable');
        }

        cfg_extend(this.config, config, deepExtend, setterProperty);

        let filename = this.data.path;
        let cfg = getContent(this.config, filename);

        await File.writeAsync(filename, cfg);
        return this;
    }
}

function getContent(config, path) {
    var hooks = File
        .getHookHandler()
        .getHooksForPath(path, 'write');

    if (hooks.length !== 0) {
        return config;
    }
    try {
        return JSON.stringify(config);
    } catch (error) {
        return config;
    }
}
