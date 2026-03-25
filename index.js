const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const ROLE_ID = '1481013079096692826';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`✅ Online: ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: '🌋 Survive Volcano For Eggs', type: 3 }],
    status: 'online'
  });
});

client.on('messageCreate', async (message) => {
  if (message.content === '!setup' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

    const embed = new EmbedBuilder()
      .setTitle('🌋 Survive Volcano For Eggs')
      .setDescription(
        '```\n⚠️  VERIFICATION REQUIRED  ⚠️\n```\n' +
        '> Welcome to **Survive Volcano For Eggs**!\n> Before you can access the server, you must verify.\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
        '🔴 **Why verify?**\n' +
        'To keep the server safe from bots and raiders.\n\n' +
        '⚡ **How long does it take?**\n' +
        'Less than a second — just click the button!\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .setColor(0xFF0000)
      .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
      .setImage('https://i.imgur.com/your-banner.png') // opcionalno — stavi tvoj banner URL ili obriši ovaj red
      .addFields(
        { name: '📋 Rules', value: 'By verifying you agree to follow all server rules.', inline: true },
        { name: '🛡️ Security', value: 'This server is protected against bots & raids.', inline: true },
        { name: '🎮 Access', value: 'After verifying you get full access to all channels.', inline: false }
      )
      .setFooter({ 
        text: '🌋 Survive Volcano For Eggs • Verification System', 
        iconURL: message.guild.iconURL() 
      })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('verify_btn')
        .setLabel('✅  Verify Now')
        .setStyle(ButtonStyle.Danger) // crveno dugme da prati temu
    );

    await message.channel.send({ embeds: [embed], components: [row] });
    await message.delete();
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton() || interaction.customId !== 'verify_btn') return;

  if (interaction.member.roles.cache.has(ROLE_ID)) {
    return interaction.reply({ 
      content: '✅ You are already verified! Enjoy the server 🌋', 
      ephemeral: true 
    });
  }

  try {
    await interaction.member.roles.add(ROLE_ID);
    await interaction.reply({
      content: '🎉 **Verification successful!**\nWelcome to **Survive Volcano For Eggs**! 🌋\nYou now have full access to the server.',
      ephemeral: true
    });
    console.log(`✅ Verified: ${interaction.user.tag}`);
  } catch (err) {
    console.error(err);
    await interaction.reply({ 
      content: '❌ Something went wrong! Please contact an admin.', 
      ephemeral: true 
    });
  }
});

client.login(process.env.TOKEN);
