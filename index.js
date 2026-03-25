const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const ROLE_ID = '1481013079096692826';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => console.log(`✅ Online: ${client.user.tag}`));

client.on('messageCreate', async (message) => {
  if (message.content === '!setup' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    const embed = new EmbedBuilder()
      .setTitle('✦ Verification')
      .setDescription('> Welcome to the server!\n\nClick the button below to confirm you\'re not a bot and gain access to all channels.')
      .setColor(0x2B2D31)
      .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
      .addFields(
        { name: '📋 Rules', value: 'By clicking the button you accept our server rules.', inline: true },
        { name: '⏱️ Quick', value: 'Verification takes less than a second.', inline: true }
      )
      .setFooter({ text: 'Your Server Name • Verification', iconURL: message.guild.iconURL() })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('verify_btn').setLabel('✅ Verify').setStyle(ButtonStyle.Success)
    );

    await message.channel.send({ embeds: [embed], components: [row] });
    await message.delete();
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton() || interaction.customId !== 'verify_btn') return;

  if (interaction.member.roles.cache.has(ROLE_ID))
    return interaction.reply({ content: '✅ You are already verified!', ephemeral: true });

  await interaction.member.roles.add(ROLE_ID);
  await interaction.reply({ content: '🎉 Verified! Welcome to the server!', ephemeral: true });
});

client.login(process.env.TOKEN);
